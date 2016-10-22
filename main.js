"use strict";
const electron_1 = require('electron');
const menu_1 = require('./menu');
let mainWindow;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({ width: 800, height: 600 });
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    menu_1.setMenu(electron_1.app.getName());
}
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
