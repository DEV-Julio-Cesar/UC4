import promptSync from 'prompt-sync'
const prompt = promptSync()

// --- Estruturas de Dados Principais ---


// let estoque = {
//     "Pao Frances": { quantidade: 100, preco: 0.75 },
//     "Bolo de Chocolate": { quantidade: 10, preco: 25.00 }
// };
let estoque = {};

// Objeto para registrar as vendas do dia
let vendas = {};

// Variável para acumular a receita total
let receitaTotal = 0.0;


// --- Funções do Controle de Estoque ---

/**
 * Exibe todos os produtos disponíveis no estoque.
 */
function listarEstoque() {
    console.log("\n--- ESTOQUE ATUAL ---");
    // Object.keys(objeto).length retorna o número de chaves (propriedades)
    if (Object.keys(estoque).length === 0) {
        console.log("O estoque está vazio.");
    } else {
        // Itera sobre as chaves (nomes dos produtos) do objeto estoque
        for (const produto in estoque) {
            const dados = estoque[produto];
            // .toFixed(2) formata o número para ter 2 casas decimais
            console.log(`Produto: ${produto} | Quantidade: ${dados.quantidade} | Preço Unitário: R$ ${dados.preco.toFixed(2)}`);
        }
    }
    console.log("-----------------------\n");
}

/**
  Função para padronizar o nome do produto (Primeira letra de cada palavra em maiúscula)
 
 * @returns {string}
 */
function formatarNomeProduto(nome) {
    return nome.trim().toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

/**
 * Consulta os detalhes de um produto específico no estoque.
 */
function consultarProduto() {
    const nomeProduto = formatarNomeProduto(prompt("Digite o nome do produto que deseja consultar: "));
    
    if (nomeProduto in estoque) {
        const dados = estoque[nomeProduto];
        console.log(`\nDetalhes do Produto: ${nomeProduto}`);
        console.log(`  - Quantidade em estoque: ${dados.quantidade}`);
        console.log(`  - Preço Unitário: R$ ${dados.preco.toFixed(2)}\n`);
    } else {
        console.log(`\nErro: O produto '${nomeProduto}' não foi encontrado no estoque.\n`);
    }
}

/**
 * Adiciona um novo produto ou atualiza a quantidade de um existente.
 */
function adicionarProduto() {
    const nomeProduto = formatarNomeProduto(prompt("Digite o nome do produto: "));
    
    const quantidadeStr = prompt(`Digite a quantidade de '${nomeProduto}' a ser adicionada: `);
    const precoStr = prompt(`Digite o preço unitário de '${nomeProduto}': `);

    // Converte a entrada do usuário para número
    const quantidade = parseInt(quantidadeStr);
    const preco = parseFloat(precoStr);

    // Validação: verifica se a conversão resultou em um número válido (não é NaN)
    if (isNaN(quantidade) || isNaN(preco) || quantidade <= 0 || preco <= 0) {
        console.log("\nErro: Quantidade ou preço inválido. Por favor, insira valores numéricos positivos.\n");
        return;
    }

    if (nomeProduto in estoque) {
        estoque[nomeProduto].quantidade += quantidade;
        estoque[nomeProduto].preco = preco; // Atualiza o preço para o mais recente
        console.log(`\nEstoque do produto '${nomeProduto}' atualizado com sucesso!\n`);
    } else {
        estoque[nomeProduto] = { quantidade: quantidade, preco: preco };
        console.log(`\nProduto '${nomeProduto}' adicionado ao estoque com sucesso!\n`);
    }
}

/**
 * Remove um produto completamente do estoque.
 */
function removerProduto() {
    const nomeProduto = formatarNomeProduto(prompt("Digite o nome do produto que deseja remover: "));

    if (nomeProduto in estoque) {
        delete estoque[nomeProduto]; // Remove a propriedade do objeto
        console.log(`\nProduto '${nomeProduto}' removido do estoque com sucesso!\n`);
    } else {
        console.log(`\nErro: O produto '${nomeProduto}' não foi encontrado no estoque.\n`);
    }
}

// --- Funções de Vendas e Relatório ---

/**
 * Registra a venda de um produto, atualizando o estoque e a receita.
 */
function registrarVenda() {
    const nomeProduto = formatarNomeProduto(prompt("Digite o nome do produto vendido: "));

    if (!(nomeProduto in estoque)) {
        console.log(`\nErro: Produto '${nomeProduto}' não encontrado no estoque.\n`);
        return;
    }

    const quantidadeVendidaStr = prompt(`Digite a quantidade de '${nomeProduto}' vendida: `);
    const quantidadeVendida = parseInt(quantidadeVendidaStr);

    if (isNaN(quantidadeVendida) || quantidadeVendida <= 0) {
        console.log("\nErro: A quantidade deve ser um número inteiro positivo.\n");
        return;
    }

    if (quantidadeVendida > estoque[nomeProduto].quantidade) {
        console.log(`\nErro: Venda não realizada. Estoque insuficiente.`);
        console.log(`Quantidade disponível de '${nomeProduto}': ${estoque[nomeProduto].quantidade}\n`);
        return;
    }

    // Realiza a venda
    estoque[nomeProduto].quantidade -= quantidadeVendida;
    const precoUnitario = estoque[nomeProduto].preco;
    const valorVenda = quantidadeVendida * precoUnitario;
    receitaTotal += valorVenda;

    if (nomeProduto in vendas) {
        vendas[nomeProduto] += quantidadeVendida;
    } else {
        vendas[nomeProduto] = quantidadeVendida;
    }
    
    console.log(`\nVenda registrada com sucesso!`);
    console.log(`Valor da venda: R$ ${valorVenda.toFixed(2)}\n`);
}

/**
 * Mostra um relatório final com as vendas, receita e estoque restante.
 */
function exibirRelatorio() {
    console.log("\n--- RELATÓRIO FINAL DO DIA ---");
    
    console.log("\n[+] Produtos Vendidos:");
    if (Object.keys(vendas).length === 0) {
        console.log("Nenhuma venda registrada hoje.");
    } else {
        for (const produto in vendas) {
            console.log(`  - Produto: ${produto} | Quantidade Vendida: ${vendas[produto]}`);
        }
    }

    console.log(`\n[+] Receita Total do Dia: R$ ${receitaTotal.toFixed(2)}`);
    
    console.log("\n[+] Estoque Restante:");
    listarEstoque(); // Reutiliza a função de listar o estoque
}


// --- Função Principal (Menu) ---

/**
 * Função principal que exibe o menu e gerencia as ações do usuário.
 */
function main() {
    while (true) {
        console.log("--- SISTEMA DE PADARIA (Node.js) ---");
        console.log("Escolha uma das opções abaixo:");
        console.log("1. Listar estoque");
        console.log("2. Consultar produto");
        console.log("3. Adicionar produto");
        console.log("4. Remover produto");
        console.log("5. Registrar venda");
        console.log("6. Relatório final");
        console.log("0. Sair");
        
        const opcao = prompt("Digite o número da opção desejada: ");

        switch (opcao) {
            case '1':
                listarEstoque();
                break;
            case '2':
                consultarProduto();
                break;
            case '3':
                adicionarProduto();
                break;
            case '4':
                removerProduto();
                break;
            case '5':
                registrarVenda();
                break;
            case '6':
                exibirRelatorio();
                break;
            case '0':
                console.log("\nSaindo do sistema. Até logo!");
                return; // Encerra a função main e, consequentemente, o loop
            default:
                console.log("\nOpção inválida! Por favor, escolha uma opção do menu.\n");
        }
    }
}

// --- Execução do Programa ---
main();