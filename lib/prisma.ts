import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client/node";
import { PrismaClient } from "@prisma/client";

const databaseUrl =
  process.env["DATABASE_URL"]?.startsWith("file:")
    ? process.env["DATABASE_URL"]
    : "file:./prisma/mindlog.db";

const libsql = createClient({
  url: databaseUrl,
});

const adapter = new PrismaLibSQL(libsql);

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
