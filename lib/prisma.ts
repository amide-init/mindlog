// Note: export is PrismaLibSql (lowercase 'q'), not PrismaLibSQL
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client/node";
import { PrismaClient } from "@prisma/client";
import path from "node:path";
import { pathToFileURL } from "node:url";

const databaseUrl = process.env["DATABASE_URL"]?.startsWith("file:")
  ? process.env["DATABASE_URL"]
  : pathToFileURL(path.join(process.cwd(), "prisma", "mindlog.db")).href;

const libsql = createClient({
  url: databaseUrl,
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
