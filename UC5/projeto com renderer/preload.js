import {contextBridge, ipcRenderer} from 'electron'


contextBridge.exposeInMainWorld('api', {
    soma: som,
    subtracao: sub,
    multiplicacao: mult,
    divicao: div,
    tema: () => ipcRenderer.send('tema')

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

      