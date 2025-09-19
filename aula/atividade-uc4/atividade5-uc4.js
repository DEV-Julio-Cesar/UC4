import PromptSync from 'prompt-sync'
const prompt = PromptSync()
let salario = 510
let bonus = 1.5/100
let anoatual = 2010




let ano = Number (prompt ( " Digite quantos anos aparti de 2010 vai ganhar futuramente: "))
for(let i = 0; i <= ano; i++){
    console.log(`
        Ano atual = ${anoatual}
        Salario atual = RS${salario}\n
        Bonus atual = ${bonus*100}%  (RS${(salario*bonus).toFixed(2)})
        Salario novo = RS ${(salario+(salario*bonus)).toFixed(2)}
        -------------------------------------`);
        salario = salario +(salario*bonus)

        anoatual++
    bonus = bonus + (1.5/100)
}
