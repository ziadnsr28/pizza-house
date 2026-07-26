/**
 * Prisma 7 Configuration File
 *
 * What it does:
 * Defines database connection URL and schema path for Prisma 7.x.
 *
 * Where it belongs:
 * prisma.config.ts (project root)
 */

import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/pizzahouse?schema=public",
  },
});
