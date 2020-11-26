const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
const dotenv = require('dotenv');
let mainWindow;

const env = dotenv.config().parsed;

function createWindow() {
    mainWindow = new BrowserWindow({show: false});
    mainWindow.maximize();
    mainWindow.removeMenu();
    mainWindow.show();
    mainWindow.loadURL(isDev ? `http://localhost:${env.PORT}` : `file://${path.join(__dirname, "../build/index.html")}`);
    mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});