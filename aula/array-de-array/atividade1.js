import promptSync from 'prompt-sync'
const prompt = promptSync()

let cardapio = []//xdsffssss1
let semana = ['segunda', 'terca','quarta','quinta','sexta','sabado','domingo']
let turno = ['cafe', 'almoco', 'jantar']
for(let i = 0; i < 7; i++){// dias da semana
    cardapio[i] = []
    for(let j = 0; j < 3; j++ ){//turnos (café, almoço, jantar)
        cardapio[i][j] = prompt(`Digite sua opção ${semana[i]} - ${turno[j]}: `)
      //  cardapio[i].push(prompt(`Digite sua opção ${semana[i]} - ${turno[j]}: `))
    }
}
console.table(cardapio) // mostra no formato tabela

let dia = prompt(`Digite sua opção para substituir cadapio digite o dia: `).toLowerCase()
let refeicao = prompt(`Digite sua opção para substituir cadapio digite a refeição: `).toLowerCase()
cardapio[0].splice(cardapio[0].indexOf('pao'), 1) // remoção com busca
let i = semana.splice(dia)
let j = turno.splice(refeicao)
switch(refeicao){
    case "cafe":
        cardapio[i][j] = prompt ("remova o cafe")
        break
        case "almoco":
        cardapio[[i]][[j]] = prompt ("remova o almoço")
        break
        case "jantar":
        cardapio[[i]][[j]] = prompt ("remova a janta")
        break
}
console.table(cardapio)


let dia = prompt(`Digite sua opção para substituir cadapio digite o dia: `).toLowerCase()
let refeicao = prompt(`Digite sua opção para substituir cadapio digite a refeição: `).toLowerCase()
let i = semana.indexOf(dia)
let j = turno.indexOf(refeicao)
switch(refeicao){
    case "cafe":
        cardapio[i][j] = prompt ("substitua a refeição desejada do cafe")
        break
        case "almoco":
        cardapio[[i]][[j]] = prompt ("substitua a refeição desejada do almoço")
        break
        case "jantar":
        cardapio[[i]][[j]] = prompt ("substitua a refeição desejada da janta")
        break
}
console.table(cardapio)

