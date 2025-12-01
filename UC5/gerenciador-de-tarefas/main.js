const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { readFileSync, writeFileSync, existsSync } = require('fs');
const { join } = require('path');

let janelaPrincipal;
const ARQUIVO_TAREFAS = join(__dirname, 'tarefas.json');

function criarJanela() {
    janelaPrincipal = new BrowserWindow({
        width: 900,
        height: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: join(__dirname, 'preload.js')
        },
        icon: null,
        show: false
    });

    janelaPrincipal.loadFile('index.html');

    janelaPrincipal.once('ready-to-show', () => {
        janelaPrincipal.show();
    });
}

app.whenReady().then(() => {
    criarJanela();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) criarJanela();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Handler para carregar tarefas
ipcMain.handle('carregar-tarefas', async () => {
    try {
        if (existsSync(ARQUIVO_TAREFAS)) {
            const dados = readFileSync(ARQUIVO_TAREFAS, 'utf8');
            return JSON.parse(dados);
        }
        return [];
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        return [];
    }
});

// Handler para salvar tarefas
ipcMain.handle('salvar-tarefas', async (event, tarefas) => {
    try {
        writeFileSync(ARQUIVO_TAREFAS, JSON.stringify(tarefas, null, 2));
        return { sucesso: true, mensagem: 'Tarefas salvas com sucesso!' };
    } catch (error) {
        console.error('Erro ao salvar tarefas:', error);
        return { sucesso: false, mensagem: 'Erro ao salvar tarefas: ' + error.message };
    }
});

// Handler para exportar tarefas
ipcMain.handle('exportar-tarefas', async (event, tarefas) => {
    try {
        const resultado = await dialog.showSaveDialog(janelaPrincipal, {
            title: 'Exportar Tarefas',
            defaultPath: 'minhas-tarefas.json',
            filters: [
                { name: 'JSON Files', extensions: ['json'] },
                { name: 'Todos os Arquivos', extensions: ['*'] }
            ]
        });

        if (!resultado.canceled && resultado.filePath) {
            writeFileSync(resultado.filePath, JSON.stringify(tarefas, null, 2));
            return { sucesso: true, mensagem: 'Tarefas exportadas com sucesso!' };
        }
        return { sucesso: false, mensagem: 'Exportação cancelada' };
    } catch (error) {
        console.error('Erro ao exportar tarefas:', error);
        return { sucesso: false, mensagem: 'Erro ao exportar: ' + error.message };
    }
});