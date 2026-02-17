import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Cache Prisma client in both development and production to prevent multiple instances
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
} else {
  // In production (Vercel), also cache to prevent connection exhaustion
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
}