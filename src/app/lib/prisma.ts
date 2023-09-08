import { PrismaClient } from "@prisma/client";

// definering for prisma client så jeg bare trenger å import prisma i alle filer istedet for å definere hver gang
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });
