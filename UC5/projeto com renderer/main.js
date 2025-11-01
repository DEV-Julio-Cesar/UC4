import { app, BrowserWindow, nativeTheme, ipcMain } from 'electron';
import path from 'node:path';
 import {fileURLToPath} from 'node:url'

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)

function criarJanela(){
    nativeTheme.themeSource = 'dark'

    

    const janela = new BrowserWindow({
        width: 800, height: 800,
        title: "Exemplo - Aplicação Desktop",      
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            devTools: true,
            preload: path.join(__dirname, 'preload.js'),
            sandbox: false


        }
    })
    janela.loadFile('calculadora.html')
    janela.webContents.openDevTools()
    janela.removeMenu()
}
 
app.whenReady().then(() => {
        criarJanela()
})
 
app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit()
    }
})
ipcMain.on('tema', () => {
    if ( nativeTheme.themeSource === 'light') {
          nativeTheme.themeSource = 'dark'
    }else {
        nativeTheme.themeSource = 'light'
    }
})