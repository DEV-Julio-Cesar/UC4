import {app, BrowserWindow, dialog, ipcMain, Menu} from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename) 

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

ipcMain.handle('salvar-arq', (event, texto) =>{
    // console.log('Texto: ',texto)
    escreverArq(texto)    
    return caminhoArquivo
})

ipcMain.handle('abrir-arq', (event) =>{
    let conteudo = lerArq()
    return conteudo
})

ipcMain.handle('salvarComo-arq', (event, texto) => {
   dialog.showSaveDialog({
        title: 'Salvar como',
        defaultPath: 'caminhoArquivo',
        filters: [{name: 'Texto', extensions: ['txt', 'doc']}]
    }).then((resultado) => {
        if(resultado.canceled) return
        caminhoArquivo = resultado.filePath
        escreverArq(texto)        
    })
    return caminhoArquivo     
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





