const {app, BrowserWindow, dialog, ipcMain, Menu, nativeTheme} = require('electron');
const path = require('path');
const fs = require('fs');

let janela = null

const criarJanela = () => {
    janela = new BrowserWindow({
        title: 'Aplicação Desktop',
        height: 600,
        width: 600,
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

let caminhoArquivo = path.join(__dirname,'arquivo.txt')

//Função para salvar o arquivo
function escreverArq (conteudo){
    try{
        fs.writeFileSync(caminhoArquivo, conteudo, 'utf-8') // escreve no aquivo
    }catch(err){
        console.error(err)
    }
}

//função para abrir o arquivo
async function lerArq(){
    let {canceled, filePaths} = await dialog.showOpenDialog({
        title: 'Abrir caminhoArquivo',
        defaultPath: 'caminhoArquivo.txt',
        filters: [{name: 'Texto', extensions: ['txt', 'doc']}],
        properties: ['openFile']
    })
    if(canceled){
        return
    }
    caminhoArquivo = filePaths[0]
    try {
        let conteudo = fs.readFileSync(caminhoArquivo, 'utf-8')
        return conteudo
    } catch (err) {
        console.error(err)
    }  
}

ipcMain.handle('salvar-arq', async (event, texto) =>{
    try {
        // Se não há caminho definido, usar "Salvar Como"
        if (!caminhoArquivo || caminhoArquivo === path.join(__dirname,'arquivo.txt')) {
            const { canceled, filePath } = await dialog.showSaveDialog({
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

ipcMain.handle('abrir-arq', (event) =>{
    let conteudo = lerArq()
    return conteudo
})

ipcMain.handle('salvarComo-arq', async (event, texto) => {
    try {
        const { canceled, filePath } = await dialog.showSaveDialog({
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
    return caminhoArquivo     
})

// Handlers opcionais para funcionalidades extras
ipcMain.handle('get-app-version', () => {
    return app.getVersion()
})

ipcMain.handle('show-message', (event, message) => {
    return dialog.showMessageBox(janela, {
        type: 'info',
        title: 'Bloco de Notas',
        message: message,
        buttons: ['OK']
    })
})

// Eventos de foco da janela
app.on('browser-window-focus', () => {
    if (janela) {
        janela.webContents.send('window-focus')
    }
})

app.on('browser-window-blur', () => {
    if (janela) {
        janela.webContents.send('window-blur')
    }
})

//criação do template do menu
const template = [
    
    {label: "Arquivo:", 
        submenu:[
            {label: "Novo", click: () => criarJanela()},
            {label: "Abrir", click: () => {janela.webContents.send('menu-abrir')}},
            {label: "Salvar", click: () => {janela.webContents.send('menu-salvar')}},
            {label: "Salvar como", click: () => {janela.webContents.send('menu-salvar-como')}},
            {type: 'separator'},
            {label: "Sair", role: 'quit'}]}, 
    {label: "Editar",
            submenu: [
                {label: 'Desfazer', role: 'undo'},
                {label: 'Refazer', role: 'redo'},
                {label: 'copiar', role: 'copy'},
                {label: 'colar', role: 'paste'},
                {label: 'recortar', role: 'cut'},
                {label: 'Limpar', role: 'delete'},
                {label: 'Selecionar tudo', role: 'selectAll'}]},
    {label: 'Exibir',  
            submenu:[
                {label: 'Zoom+', type: 'radio', checked: false, 
                click: () => {
                    let janelaatual = janela.webContents.getZoomFactor()    
                    janela.webContents.setZoomFactor(0.1 + janelaatual)},
                accelerator: 'ctrl + =', },
                {label: 'Zoom-', role: 'zoomout'},
                {label: 'Trocar tema', type: 'checkbox', checked: false, 
                    click: () => nativeTheme.themeSource = 'dark'} ]}]





