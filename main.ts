import {app, BrowserWindow} from 'electron';
import {setMenu} from './menu';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: Electron.BrowserWindow;

function createWindow() {
    mainWindow = new BrowserWindow({ width: 800, height: 600 });
    mainWindow.loadURL(`file://${__dirname}/index.html`);
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    setMenu(app.getName());
}

app.on('ready', createWindow)

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
