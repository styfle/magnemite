import {app, BrowserWindow} from 'electron';
import {setMenu} from './menu';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: Electron.BrowserWindow;

let seqNumber = 0;

const g: any = global;
g['counts'] = {
    recordingNumber: 0
};

function createWindow() {
    mainWindow = new BrowserWindow({ width: 1024, height: 768 });
    mainWindow.loadURL(`file://${__dirname}/index.html`);

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    /*
    mainWindow.on('will-navigate', () => {
        mainWindow.webContents.executeJavaScript(`console.log('will navigate'); if ('__stopRecording' in window) __stopRecording();`);
    });

    mainWindow.on('did-navigate', () => {
        seqNumber += 1;
        mainWindow.webContents.executeJavaScript(`console.log('did navigate'); var r = require('./renderer.js'); r.startRecording(${seqNumber});`);
    });
    */

    setMenu(mainWindow, app.getName());
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    // On OS X, stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X, re-create a window when dock icon is clicked and no other windows open
    if (mainWindow === null) {
        createWindow();
    }
});
