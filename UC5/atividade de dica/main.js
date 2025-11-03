// main.js
import { app, BrowserWindow, nativeTheme, ipcMain } from 'electron';
import path from 'node:path';

// Define o diretório base para carregar o preload.js
const __dirname = path.dirname(new URL(import.meta.url).pathname);

function criarJanela() {
    nativeTheme.themeSource = 'light'; // Define um tema padrão

    const janela = new BrowserWindow({
        width: 500,
        height: 700,
        resizable: false,
        // Configurações do jogo: Título e Ícone
        title: "Jogo da Adivinhação (Adivinhe o Número)",
        icon: path.join(__dirname, 'icon.png'), // Certifique-se de ter um arquivo 'icon.png'
        webPreferences: {
            // Caminho para o preload.js
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            devTools: true
        }
    });

    janela.loadFile('index.html');
    // janela.webContents.openDevTools(); // Descomente para depurar
    janela.removeMenu(); // Remove o menu para dar um visual mais limpo de jogo
}
 
app.whenReady().then(() => {
    criarJanela();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            criarJanela();
        }
    });
});
 
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
ipcMain.on('tema', () => {
    nativeTheme.themeSource = 'dark'
});