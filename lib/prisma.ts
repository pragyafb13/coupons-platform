import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with optimized configuration for serverless
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Always cache Prisma client to prevent multiple instances and connection exhaustion
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
} else {
  // In production, also cache to prevent connection exhaustion
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = prisma;
  }
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