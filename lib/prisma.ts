// Note: export is PrismaLibSql (lowercase 'q'), not PrismaLibSQL
// v7.x API: PrismaLibSql takes a Config object { url }, not a pre-created Client
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import path from "node:path";

// libsql accepts "file:<path>" where path can be relative or absolute
const url =
  process.env["DATABASE_URL"] ??
  `file:${path.resolve(process.cwd(), "prisma", "mindlog.db")}`;

const adapter = new PrismaLibSql({ url });

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
