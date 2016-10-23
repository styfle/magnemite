"use strict";
const electron_1 = require('electron');
const menu_1 = require('./menu');
let mainWindow;
let seqNumber = 0;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({ width: 1024, height: 768 });
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    mainWindow.on('will-navigate', () => {
        mainWindow.webContents.executeJavaScript(`console.log('will navigate'); if ('__stopRecording' in window) __stopRecording();`);
    });
    mainWindow.on('did-navigate', () => {
        seqNumber += 1;
        mainWindow.webContents.executeJavaScript(`console.log('did navigate'); var r = require('./renderer.js'); r.startRecording(${seqNumber});`);
    });
    menu_1.setMenu(mainWindow, electron_1.app.getName());
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
