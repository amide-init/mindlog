// Note: export is PrismaLibSql (lowercase 'q'), not PrismaLibSQL
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client/node";
import { PrismaClient } from "@prisma/client";
import path from "node:path";
import { pathToFileURL } from "node:url";

const defaultDbPath = path.join(process.cwd(), "prisma", "mindlog.db");
const defaultDbUrl = pathToFileURL(defaultDbPath).href;

const envUrl = process.env["DATABASE_URL"];
const databaseUrl =
  typeof envUrl === "string" && envUrl.startsWith("file:")
    ? envUrl
    : defaultDbUrl;

// Ensure we never pass undefined to libsql (e.g. when env is missing in Turbopack)
const url =
  typeof databaseUrl === "string" && databaseUrl.length > 0
    ? databaseUrl
    : defaultDbUrl;

const libsql = createClient({
  url,
});

const adapter = new PrismaLibSql(libsql);

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
