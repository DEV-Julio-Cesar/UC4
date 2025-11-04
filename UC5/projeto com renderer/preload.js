import {contextBridge, ipcRenderer} from 'electron'


contextBridge.exposeInMainWorld('api', {
    soma: som,
    subtracao: sub,
    multiplicacao: mult,
    divicao: div,
    tema: () => ipcRenderer.send('tema'),
    criarJanela: () => {ipcRenderer.send('criar-janela')},
    somass: (n1,n2) => ipcRenderer.invoke('calc-soma', n1, n2),
    enviarMsg: (msg) => ipcRenderer.send('enviar-msg', msg),
    receberMsg: (callback) => ipcRenderer.on('devolver-msg', (event, msg2) => callback(msg2))

})
function som(a,b){
    return a + b
}
function sub(a,b){
    return a - b
}
function mult(a,b){
    return a * b
}
function div(a,b){
    return a / b
}

      