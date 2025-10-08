import PromptSync from "prompt-sync"
const prompt = PromptSync()

const ContaBancaria = require('./ContaBancaria.js')
const prompt = require('prompt-sync')() // Importa e inicializa a biblioteca

// Função para obter os dados iniciais da conta
function obterDadosConta() {
    const nome = prompt("Digite o nome do titular: ")
    const agencia = prompt("Digite o número da agência: ")
    const conta = prompt("Digite o número da conta: ")
    const data = prompt("Digite a data de abertura (dd/mm/aaaa): ")
    
    return new ContaBancaria(nome, conta, agencia, data);
}

// Função para o menu de operações interativas
function menuOperacoes(conta) {
    let encerrar = false;
    while (!encerrar) {
        console.log("\n--- Operações Disponíveis ---");
        console.log(`Conta: ${conta.numeroConta} | Titular: ${conta.nomeTitular}`);
        console.log("1. Depositar")
        console.log("2. Sacar")
        console.log("3. Exibir Saldo e Rendimento")
        console.log("4. Exibir Dados da Conta")
        console.log("5. Sair")

        const opcao = prompt("Escolha uma opção: ")

        switch (opcao) {
            case '1':try{
                const valorDeposito = parseFloat(prompt("Digite o valor para depósito: "))
                conta.depositar(valorDeposito); // Testa a funcionalidade de depósito 
                catch(error){ // captura da exceção
                    console.error(error.message) // tratamento da exceção gerada
                }
            case '2':
                const valorSaque = parseFloat(prompt("Digite o valor para saque: "))
                conta.sacar(valorSaque); // Testa a funcionalidade de saque [cite: 130]
                break;
            case '3':
                console.log(`Saldo atual: R$ ${conta.saldo.toFixed(2)}`)
                const rendimento = conta.calcularRendimento(); // Testa o cálculo de rendimento 
                console.log(`Rendimento mensal projetado: R$ ${rendimento.toFixed(2)}`)
                break;
            case '4':
                conta.imprimirInfo(); // Imprime informações sobre a conta 
                break;
            case '5':
                encerrar = true
                console.log("Encerrando operações...")
                break;
            default:
                console.log("Opção inválida. Tente novamente.")
                break;
        }
    }
}


function main() {
    console.log("--- Abertura da Conta 1 ---")
    const conta1 = obterDadosConta(); // Cria o primeiro objeto conta 

    console.log("\n--- Abertura da Conta 2 ---")
    const conta2 = obterDadosConta(); // Cria o segundo objeto conta 

    console.log("\n===================================")
    console.log("Contas criadas com sucesso!");
    console.log("===================================")
    console.log("\n--- Conta 1 ---")
    conta1.imprimirInfo();
    console.log("\n--- Conta 2 ---")
    conta2.imprimirInfo()
    
    // Inicia o menu interativo para a primeira conta
    menuOperacoes(conta1)
}

main()