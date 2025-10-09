import PromptSync from "prompt-sync";
const prompt = PromptSync()

let pessoa1 = {
    nome: prompt('Digite seu Nome: '),
    dataNasc: new Date(prompt('Digite sua data de nascimento AAAA/MM/DD: ')) ,
    sexo: prompt('Digite seu sexo: '),
     cpf: prompt('Digite seu CPF: '),
     mostrarInfo: function(){
        console.log(`Dados Pessoais: ${pessoa1.nome},${pessoa1.dataNasc.toLocaleString('pt-BR')}`)


     }
    }

pessoa1.mostrarInfo()

class Pessoa {
    constructor(nome, dataNasc, sexo, cpf){
        this.nome = nome
        this.dataNasc = dataNasc
        this.sexo = sexo
        this.cpf = cpf
    }
    mostrarInfo(){
        console.log(`Dados Pessoais: ${this.nome},${this.dataNasc.toLocaleString('pt-BR')}`)
    }
}

    
    let array_pessoas = [ ]
    let pessoa2 = new Pessoa(prompt('Digite seu nome: '),
                    new Date(prompt('Digite sua data de nascimento AAAA/MM/DD: ')),
                    prompt('Digite seu sexo: '),
                    prompt('Digite seu CPF: '))

    pessoa2.mostrarInfo()
    array_pessoas.push(pessoa2)
    console.log(array_pessoas)
    console.log(array_pessoas[0])
    console.log(array_pessoas[0].nome)



