import {app, BrowserWindow} from 'electron'
 
const __dirname
function criarJanela(){
    const janela = new BrowserWindow({
        width: 800, height: 800,
        title: "Exemplo - Aplicação Desktop",      
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            devTools: true,
            preload: `${__dirname}/preload.js`
        }
    })
    janela.loadFile('index.html')
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