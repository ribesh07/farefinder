import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Reuse a single client across hot reloads (dev) and serverless invocations (prod).
globalForPrisma.prisma = prisma;

if (process.env.NODE_ENV === "production") {
  const shutdown = async () => {
    await prisma.$disconnect();
  };

  process.on("beforeExit", shutdown);
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
