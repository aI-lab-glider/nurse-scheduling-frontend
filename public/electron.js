const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
const dotenv = require('dotenv');
let mainWindow;

const globalEnv = dotenv.config().parsed;
const localEnv = dotenv.config({path: `${__dirname}/../.env.local`}).parsed
const env = {...globalEnv, ...localEnv};
function createWindow() {    
    if (env.FIXED_WINDOW_SIZE==="true") {
        mainWindow = new BrowserWindow({show: false, minHeight: 500, minWidth: 1500});
    } else {
        mainWindow = new BrowserWindow({show: false});        
    }
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