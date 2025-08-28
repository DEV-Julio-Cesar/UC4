import PromptSync from "prompt-sync" // Importe do prompt
const prompt = PromptSync() // variavel do prompt
let ant = 0, atual = 1, prox = 0
let termo = Number (prompt ( " Digite a quantidade de termo: "))
for(let i = 1; i <= termo; i++){
    console.log(" os termos são:", ant)
 
prox = ant + atual
ant = atual
atual = prox

 
}