import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Helper function to retry queries on connection errors
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 2,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const isConnectionError = 
        error?.message?.includes("MaxClientsInSessionMode") ||
        error?.message?.includes("max clients reached") ||
        error?.code === "P1001";
      
      if (isConnectionError && i < maxRetries - 1) {
        console.warn(`Connection error, retrying in ${delay}ms... (attempt ${i + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
}

// Create Prisma client with optimized configuration for serverless and connection pooling
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

// Always cache Prisma client to prevent multiple instances and connection exhaustion
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}

// Export a wrapper that adds retry logic
export const prismaWithRetry = {
  ...prisma,
  category: {
    ...prisma.category,
    findMany: (args?: any) => withRetry(() => prisma.category.findMany(args)),
  },
  coupon: {
    ...prisma.coupon,
    findMany: (args?: any) => withRetry(() => prisma.coupon.findMany(args)),
    count: (args?: any) => withRetry(() => prisma.coupon.count(args)),
  },
  store: {
    ...prisma.store,
    findMany: (args?: any) => withRetry(() => prisma.store.findMany(args)),
    count: (args?: any) => withRetry(() => prisma.store.count(args)),
  },
  banner: {
    ...prisma.banner,
    findMany: (args?: any) => withRetry(() => prisma.banner.findMany(args)),
  },
};

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