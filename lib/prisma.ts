import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  queryQueue: Promise<any> | undefined;
};

// Create Prisma client with optimized configuration for serverless
// Reduced logging to minimize overhead
const basePrisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
  });

// Always cache Prisma client to prevent multiple instances and connection exhaustion
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = basePrisma;
}

// Initialize query queue
if (!globalForPrisma.queryQueue) {
  globalForPrisma.queryQueue = Promise.resolve();
}

// Helper function to queue database queries sequentially
// This prevents connection pool exhaustion by ensuring only one query runs at a time
async function queuedQuery<T>(queryFn: () => Promise<T>): Promise<T> {
  // Wait for previous query to complete, then execute this one
  const previousQuery = globalForPrisma.queryQueue || Promise.resolve();
  
  const currentQuery = previousQuery
    .then(() => new Promise(resolve => setTimeout(resolve, 50))) // Small delay between queries
    .then(() => queryFn())
    .catch((error) => {
      // If it's a connection error, wait a bit longer and retry once
      if (error?.message?.includes("MaxClientsInSessionMode") || 
          error?.message?.includes("max clients reached") ||
          error?.message?.includes("Connection") ||
          error?.code === "P1001" || // Prisma connection error
          error?.code === "P1017") { // Prisma server closed connection
        console.warn("Database connection issue, waiting before retry...", error?.message);
        return new Promise(resolve => setTimeout(resolve, 200))
          .then(() => queryFn())
          .catch((retryError) => {
            console.error("Database query failed after retry:", retryError?.message);
            throw retryError;
          });
      }
      console.error("Database query error:", error?.message);
      throw error;
    });
  
  globalForPrisma.queryQueue = currentQuery.catch(() => {}); // Don't let errors break the queue
  return currentQuery;
}

// Wrap Prisma client to queue all queries
// This ensures NextAuth and all other queries go through the queue
export const prisma = new Proxy(basePrisma, {
  get(target, prop) {
    const value = (target as any)[prop];
    
    // If it's a model (like prisma.user, prisma.session, etc.), wrap its methods
    if (value && typeof value === 'object' && !Array.isArray(value) && prop !== '$connect' && prop !== '$disconnect' && prop !== '$on' && prop !== '$use' && !prop.toString().startsWith('$')) {
      return new Proxy(value, {
        get(modelTarget, modelProp) {
          const modelValue = (modelTarget as any)[modelProp];
          
          // If it's a query method (findMany, findUnique, create, etc.), wrap it
          if (typeof modelValue === 'function' && 
              ['findMany', 'findUnique', 'findFirst', 'create', 'update', 'delete', 'deleteMany', 'updateMany', 'createMany', 'count', 'aggregate', 'groupBy'].includes(modelProp.toString())) {
            return function(...args: any[]) {
              return queuedQuery(() => modelValue.apply(modelTarget, args));
            };
          }
          
          return modelValue;
        }
      });
    }
    
    return value;
  }
});

// Export the queuedQuery function for explicit use if needed
export { queuedQuery };

// Ensure connections are properly closed
if (typeof window === "undefined") {
  // Server-side only
  process.on("beforeExit", async () => {
    await prisma.$disconnect();
  });
  
  // Also handle SIGINT and SIGTERM for graceful shutdown
  process.on("SIGINT", async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
  
  process.on("SIGTERM", async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}