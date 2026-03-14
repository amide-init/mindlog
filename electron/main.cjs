const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const http = require("http");

const isDev = !!process.env.NEXT_DEV_URL;
const DEV_URL = process.env.NEXT_DEV_URL || "http://localhost:3000";
const PROD_PORT = 3100;
const PROD_URL = `http://127.0.0.1:${PROD_PORT}`;

let serverProcess = null;

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
  const serverJs = path.join(process.resourcesPath, "nextjs", "server.js");
  serverProcess = spawn(process.execPath, [serverJs], {
    env: {
      ...process.env,
      PORT: String(PROD_PORT),
      HOSTNAME: "127.0.0.1",
      NODE_ENV: "production",
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
