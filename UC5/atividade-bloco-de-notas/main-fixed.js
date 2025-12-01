const {app, BrowserWindow, dialog, ipcMain, Menu, nativeTheme} = require('electron');
const path = require('path');
const fs = require('fs');

let janela = null
let caminhoArquivo = path.join(__dirname,'arquivo.txt')

const criarJanela = () => {
    janela = new BrowserWindow({
        title: 'Bloco de Notas',
        height: 800,
        width: 1000,
        resizable: true,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            preload: path.join(__dirname, 'preload.js'),
            sandbox: false
        }      
    })
    janela.removeMenu()
    // janela.webContents.openDevTools()
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
    janela.loadFile(path.join(__dirname,'index.html'))
}

app.whenReady().then(() => {
    criarJanela()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) criarJanela()
})

//Função para salvar o arquivo
function escreverArq (conteudo){
    try{
        fs.writeFileSync(caminhoArquivo, conteudo, 'utf-8')
        console.log('Arquivo salvo em:', caminhoArquivo)
    }catch(err){
        console.error('Erro ao escrever arquivo:', err)
    }
}

//função para abrir o arquivo
async function lerArq(){
    try {
        let {canceled, filePaths} = await dialog.showOpenDialog(janela, {
            title: 'Abrir arquivo',
            defaultPath: 'documento.txt',
            filters: [{name: 'Texto', extensions: ['txt', 'doc', 'docx']}],
            properties: ['openFile']
        })
        
        if(canceled){
            return null
        }
        
        caminhoArquivo = filePaths[0]
        let conteudo = fs.readFileSync(caminhoArquivo, 'utf-8')
        return conteudo
    } catch (err) {
        console.error('Erro ao ler arquivo:', err)
        return null
    }  
}

// Handlers IPC
ipcMain.handle('salvar-arq', async (event, texto) => {
    try {
        // Se não há caminho definido ou é o arquivo padrão, usar "Salvar Como"
        if (!caminhoArquivo || caminhoArquivo === path.join(__dirname,'arquivo.txt')) {
            const { canceled, filePath } = await dialog.showSaveDialog(janela, {
                title: 'Salvar arquivo',
                defaultPath: 'documento.txt',
                filters: [{name: 'Texto', extensions: ['txt', 'doc']}]
            });
            
            if (canceled) {
                return null;
            }
            caminhoArquivo = filePath;
        }
        
        escreverArq(texto);
        return caminhoArquivo;
    } catch (error) {
        console.error('Erro ao salvar:', error);
        return null;
    }
})

ipcMain.handle('abrir-arq', async (event) => {
    try {
        const conteudo = await lerArq()
        return conteudo
    } catch (error) {
        console.error('Erro ao abrir:', error)
        return null
    }
})

ipcMain.handle('salvarComo-arq', async (event, texto) => {
    try {
        const { canceled, filePath } = await dialog.showSaveDialog(janela, {
            title: 'Salvar como',
            defaultPath: 'documento.txt',
            filters: [{name: 'Texto', extensions: ['txt', 'doc']}]
        });
        
        if (canceled) {
            return null;
        }
        
        caminhoArquivo = filePath;
        escreverArq(texto);
        return caminhoArquivo;
    } catch (error) {
        console.error('Erro ao salvar como:', error);
        return null;
    }
})

// Menu da aplicação
const template = [
    {
        label: 'Arquivo',
        submenu: [
            {
                label: 'Abrir',
                accelerator: 'CmdOrCtrl+O',
                click: () => {
                    janela.webContents.send('menu-abrir');
                }
            },
            {
                label: 'Salvar',
                accelerator: 'CmdOrCtrl+S',
                click: () => {
                    janela.webContents.send('menu-salvar');
                }
            },
            {
                label: 'Salvar Como',
                accelerator: 'CmdOrCtrl+Shift+S',
                click: () => {
                    janela.webContents.send('menu-salvar-como');
                }
            },
            { type: 'separator' },
            {
                label: 'Sair',
                accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                click: () => {
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'Editar',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'selectall' }
        ]
    },
    {
        label: 'Visualizar',
        submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' }
        ]
    }
]
