// main.js
import { app, BrowserWindow, nativeTheme } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'url'; // ⬅️ PASSO 1: Importar o conversor de URL

// Define o diretório base para carregar o preload.js de forma segura em todos os sistemas
const __filename = fileURLToPath(import.meta.url); // ⬅️ PASSO 2: Obter o nome do arquivo (URI)
const __dirname = path.dirname(__filename);       // ⬅️ PASSO 3: Converter para o caminho do diretório (seguro)

function criarJanela() {
    nativeTheme.themeSource = 'light'; 

    const janela = new BrowserWindow({
        width: 500,
        height: 700,
        resizable: false,
        title: "Jogo da Adivinhação (Adivinhe o Número)",
        icon: path.join(__dirname, 'icon.png'),
        webPreferences: {
            // Usa o __dirname corrigido para encontrar o preload.js
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            devTools: true
        }
    });

    janela.loadFile('index.html');
    // janela.webContents.openDevTools(); // Mantenha descomentado para verificar!
    janela.removeMenu();
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