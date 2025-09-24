import PromptSync from "prompt-sync"
const prompt = PromptSync()

// const Cliente = require('./Cliente.js')
// const prompt = require('prompt-sync')() // Importa e inicializa a biblioteca

// Função para obter dados de um cliente de forma síncrona
function obterDadosCliente() {
    console.log("Por favor, forneça os dados do cliente:");
    const nome = prompt("Nome: ")
    const endereco = prompt("Endereço: ")
    const rendaStr = prompt("Renda: ")
    
    // Converte a renda para float
    const renda = parseFloat(rendaStr)

    // Cria e retorna uma nova instância do Cliente
    return new Cliente(nome, endereco, renda)
}

function main() {
    console.log("--- Cadastro do Cliente 1 ---")
    const cliente1 = obterDadosCliente(); // Chama a função para o primeiro cliente [cite: 124]

    console.log("\n--- Cadastro do Cliente 2 ---")
    const cliente2 = obterDadosCliente(); // Chama a função para o segundo cliente [cite: 124]

    console.log("\n===================================")
    console.log("Informações dos Clientes Cadastrados")
    console.log("===================================")

    console.log("\n--- Cliente 1 ---")
    cliente1.imprimirInfo(); // Imprime as informações [cite: 125]

    console.log("\n--- Cliente 2 ---")
    cliente2.imprimirInfo(); // Imprime as informações [cite: 125]
}

main()