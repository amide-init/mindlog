// Basic Electron main process that opens the Next.js app.

const { app, BrowserWindow } = require("electron");

// URL of the Next.js dev server. In production you will point this to a built app.
const NEXT_DEV_URL = process.env.NEXT_DEV_URL || "http://localhost:3000";

function createWindow() {
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

  win.loadURL(NEXT_DEV_URL);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

