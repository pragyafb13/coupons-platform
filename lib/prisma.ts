import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with optimized configuration for serverless
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
  });

// Always cache Prisma client to prevent multiple instances
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}

export { prisma };

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