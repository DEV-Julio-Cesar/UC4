/import PromptSync from 'prompt-sync'
const prompt = PromptSync()
let resultado = 1

console.log('Sequência numerica FOR: ')
for(let i = 6.99; i <= 356.49; i = i + 6.99){
    console.log(`Quantidade ${resultado} Tabela de preço: = `,i.toFixed(2));
    resultado++

}
