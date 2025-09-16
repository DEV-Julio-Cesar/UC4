import promptSync from 'prompt-sync'
const prompt = promptSync()

let nome = ["pipoca", "maça", "arroz", "limao"]
let preco = [2, 5, 8, 7]
let categoria = ["Bagana", "hortifruti", "Não parecivel", "hortifruti"]
let soma = 0

//cost supemercado = [index]
categorias.forEach((categoria, indice) => {
    if (categoria === "Hortifruti") {
   console.log(nomes[indice]);
   }
})

for(let i = 0; i < nome.length; i++){
    console.log(`Nome : ${nome[i]}`)
     console.log(`Preço : ${preco[i]}`)
      console.log(`Categoria : ${categoria[i]}`)
      console.log(`Preço com reajuste de 5% : ${preco[i]+preco[i]*5/100}`)
      soma += preco[i]
      
}

let somatotalHortifruti = categorias.reduce((acumulador, categoriaAtual, indice) => {
    if (categoriaAtual === 'Hortifruti') { 
      return acumulador + prescoacressimo[indice]
    } 
    return acumulador;
  }, 0)

  
console.log(`Preço dos produtos totais ${soma}`)

let menorque5 = preco.every(valor => valor < 5)


if (!menorque5){
    console.log("existe  valor menor que 5 : sim")
}else
    {
    console.log("Todos os produtor maior que 5: não")   
}

let menorque0 = preco.every(valor => valor < 0)
if (menorque0){
    
    console.log("existe valor menor que 0 : sim")
}else
    {
 
    console.log("Todos os produtor maior que 0: não") 
}




