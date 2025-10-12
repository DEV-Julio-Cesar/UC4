import promptSync from "prompt-sync";
const prompt = promptSync()

//função declarada - forma tradicional 
function soma (){ //sem paraâmetro - sem retorno
    let n1 = Number(prompt('Digite um numero'))
    let n2 = Number(prompt('Digite um numero'))
    console.log(`Soma: ${n1+n2}`)


}
soma() //chama a função

function subtracao(n1,n2){// com parametro -  com retorno
    let result = n1-n2
    return n1-n2 // result

}
let nun1 = Number(prompt('Digite um numero'))
let nun2 = Number(prompt('Digite um numero'))

let sub = subtracao(nun1,nun2)
console.log(`Subtração: ${sub}`)
console.log(`Subtração: ${subtracao(num1, num2)}`)
