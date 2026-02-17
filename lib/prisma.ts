import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  queryQueue: Promise<any> | undefined;
};

// Create Prisma client with optimized configuration for serverless
// Reduced logging to minimize overhead
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
  });

// Always cache Prisma client to prevent multiple instances and connection exhaustion
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}

// Initialize query queue
if (!globalForPrisma.queryQueue) {
  globalForPrisma.queryQueue = Promise.resolve();
}

// Helper function to queue database queries sequentially
// This prevents connection pool exhaustion by ensuring only one query runs at a time
export async function queuedQuery<T>(queryFn: () => Promise<T>): Promise<T> {
  // Wait for previous query to complete, then execute this one
  const previousQuery = globalForPrisma.queryQueue || Promise.resolve();
  
  const currentQuery = previousQuery
    .then(() => new Promise(resolve => setTimeout(resolve, 50))) // Small delay between queries
    .then(() => queryFn())
    .catch((error) => {
      // If it's a connection error, wait a bit longer and retry once
      if (error?.message?.includes("MaxClientsInSessionMode") || 
          error?.message?.includes("max clients reached")) {
        console.warn("Connection pool exhausted, waiting before retry...");
        return new Promise(resolve => setTimeout(resolve, 200))
          .then(() => queryFn());
      }
      throw error;
    });
  
  globalForPrisma.queryQueue = currentQuery.catch(() => {}); // Don't let errors break the queue
  return currentQuery;
}

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