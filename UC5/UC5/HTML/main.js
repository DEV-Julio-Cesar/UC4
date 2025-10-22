import {app, BrowserWindow} from 'electron';

function createWindow() {
    const win = new BrowserWindow({
        width: 900,
        height: 750,
        backgroundColor: '#ffffff',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
        
    });
    win.loadFile('Index.html')
}

app.whenReady().then(() => {
    createWindow(); 
})