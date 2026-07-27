import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaPool?: Pool;
};

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5432/pizzahouse?schema=public";

let pool: Pool;
let adapter: PrismaPg;
let prismaInstance: PrismaClient;

try {
  pool = globalForPrisma.prismaPool ?? new Pool({ connectionString });
  adapter = new PrismaPg(pool);
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient({ adapter });
} catch (error) {
  console.error("[PRISMA INIT ERROR]", error);
  throw error;
}

export const prisma = prismaInstance;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaPool = pool;
}

