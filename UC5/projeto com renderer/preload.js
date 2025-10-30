import {contextBridge} from 'electron'


contextBridge.exposeInMainWorld('api', {
    soma: som,
    subtracao: sub,
    multiplicacao: mult,
    divicao: div,
    calcular: (entrada) => {
        return eval(entrada)
    }

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

      