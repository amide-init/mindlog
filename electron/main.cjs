const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn, execFileSync } = require("child_process");
const http = require("http");
const fs = require("fs");

const isDev = !!process.env.NEXT_DEV_URL;
const DEV_URL = process.env.NEXT_DEV_URL || "http://localhost:3000";
const PROD_PORT = 3100;
const PROD_URL = `http://127.0.0.1:${PROD_PORT}`;

let serverProcess = null;

function runMigrations(dbUrl) {
  const dbPath = dbUrl.replace(/^file:/, "");
  const migrationsPath = isDev
    ? path.join(__dirname, "..", "prisma", "migrations")
    : path.join(process.resourcesPath, "nextjs", "prisma", "migrations");

  const sqlite3 = "/usr/bin/sqlite3";

  // Create Prisma-compatible migrations tracking table
  execFileSync(sqlite3, [
    dbPath,
    `CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
      "id"                  TEXT PRIMARY KEY NOT NULL,
      "checksum"            TEXT NOT NULL DEFAULT '',
      "finished_at"         DATETIME,
      "migration_name"      TEXT NOT NULL,
      "logs"                TEXT,
      "rolled_back_at"      DATETIME,
      "started_at"          DATETIME NOT NULL DEFAULT current_timestamp,
      "applied_steps_count" INTEGER NOT NULL DEFAULT 0
    );`,
  ]);

  const dirs = fs
    .readdirSync(migrationsPath)
    .filter((d) =>
      fs.statSync(path.join(migrationsPath, d)).isDirectory()
    )
    .sort();

  for (const dir of dirs) {
    const sqlFile = path.join(migrationsPath, dir, "migration.sql");
    if (!fs.existsSync(sqlFile)) continue;

    // Skip if already applied
    const count = execFileSync(sqlite3, [
      dbPath,
      `SELECT COUNT(*) FROM "_prisma_migrations" WHERE migration_name='${dir}' AND finished_at IS NOT NULL;`,
    ])
      .toString()
      .trim();

    if (count === "1") continue;

    const sql = fs.readFileSync(sqlFile, "utf8");
    execFileSync(sqlite3, [dbPath, sql]);

    execFileSync(sqlite3, [
      dbPath,
      `INSERT OR REPLACE INTO "_prisma_migrations" (id, checksum, finished_at, migration_name, applied_steps_count)
       VALUES ('${dir}', '', datetime('now'), '${dir}', 1);`,
    ]);
  }
}

function waitForServer(url, attempts = 40) {
  return new Promise((resolve, reject) => {
    const try_ = () =>
      http.get(url, () => resolve()).on("error", () => {
        if (--attempts > 0) setTimeout(try_, 500);
        else reject(new Error("Next.js server did not start in time"));
      });
    try_();
  });
}

async function startServer() {
  const userDataPath = app.getPath("userData");
  fs.mkdirSync(userDataPath, { recursive: true });
  const dbUrl = `file:${path.join(userDataPath, "mindlog.db")}`;

  runMigrations(dbUrl);

  const serverJs = path.join(process.resourcesPath, "nextjs", "server.js");
  serverProcess = spawn(process.execPath, [serverJs], {
    env: {
      ...process.env,
      PORT: String(PROD_PORT),
      HOSTNAME: "127.0.0.1",
      NODE_ENV: "production",
      DATABASE_URL: dbUrl,
    },
    stdio: "pipe",
  });

  serverProcess.on("error", (err) => console.error("Server error:", err));
  await waitForServer(PROD_URL);
}

function createWindow(url) {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: "MindLog",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadURL(url);
}

app.whenReady().then(async () => {
  const url = isDev ? DEV_URL : PROD_URL;
  if (!isDev) await startServer();
  createWindow(url);

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow(url);
  });
});

app.on("window-all-closed", () => {
  if (serverProcess) serverProcess.kill();
  if (process.platform !== "darwin") app.quit();
});
