import promptSync from 'prompt-sync'
const prompt = promptSync()

let estoque = [];
let vendas = [];
let receitaTotal = 0.0;

// --- Funções do Controle de Estoque ---


  //Exibe todos os produtos disponíveis no estoque.
 
function listarEstoque() {
    console.log("\n--- ESTOQUE ATUAL ---");
    if (estoque.length === 0) {
        console.log("O estoque está vazio.");
    } else {
        // .forEach() é um método de array para executar uma função para cada item.
        estoque.forEach(produto => {
            console.log(`Produto: ${produto.nome} | Quantidade: ${produto.quantidade} | Preço Unitário: R$ ${produto.preco.toFixed(2)}`);
        });
    }
    console.log("-----------------------\n");
}


 // Consulta os detalhes de um produto específico no estoque.
 
function consultarProduto() {
    const nomeProduto = prompt("Digite o nome do produto que deseja consultar: ").trim();
    
    // .find() é um método de array que retorna o primeiro elemento que satisfaz a condição.
    const produtoEncontrado = estoque.find(produto => produto.nome.toLowerCase() === nomeProduto.toLowerCase());
    
    if (produtoEncontrado) {
        console.log(`\nDetalhes do Produto: ${produtoEncontrado.nome}`);
        console.log(`  - Quantidade em estoque: ${produtoEncontrado.quantidade}`);
        console.log(`  - Preço Unitário: R$ ${produtoEncontrado.preco.toFixed(2)}\n`);
    } else {
        console.log(`\nErro: O produto '${nomeProduto}' não foi encontrado no estoque.\n`);
    }
}


 // Adiciona um novo produto ou atualiza a quantidade de um existente.
 
function adicionarProduto() {
    const nomeProduto = prompt("Digite o nome do produto: ").trim();
    const quantidade = parseInt(prompt(`Digite a quantidade de '${nomeProduto}': `));
    const preco = parseFloat(prompt(`Digite o preço unitário de '${nomeProduto}': `));

    if (isNaN(quantidade) || isNaN(preco) || quantidade <= 0 || preco <= 0) {
        console.log("\nErro: Quantidade e preço devem ser números positivos.\n");
        return;
    }

    const produtoExistente = estoque.find(p => p.nome.toLowerCase() === nomeProduto.toLowerCase());

    if (produtoExistente) {
        // Se o produto já existe, apenas atualiza seus dados.
        produtoExistente.quantidade += quantidade;
        produtoExistente.preco = preco; // Atualiza o preço
        console.log(`\nEstoque do produto '${nomeProduto}' atualizado com sucesso!\n`);
    } else {
        // Se é um produto novo, cria um novo objeto e o adiciona ao array.
        const novoProduto = {
            nome: nomeProduto,
            quantidade: quantidade,
            preco: preco
        };
        estoque.push(novoProduto); // .push() adiciona um item ao final do array.
        console.log(`\nProduto '${nomeProduto}' adicionado ao estoque com sucesso!\n`);
    }
}


 // Remove um produto completamente do estoque.
 
function removerProduto() {
    const nomeProduto = prompt("Digite o nome do produto que deseja remover: ").trim();

    const tamanhoOriginal = estoque.length;
    
    // .filter() cria um NOVO array com todos os elementos que passam no teste.
    // Aqui, estamos mantendo apenas os produtos cujo nome é DIFERENTE do que queremos remover.
    estoque = estoque.filter(produto => produto.nome.toLowerCase() !== nomeProduto.toLowerCase());

    if (estoque.length < tamanhoOriginal) {
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
    const nomeProduto = prompt("Digite o nome do produto vendido: ").trim();

    const produtoNoEstoque = estoque.find(p => p.nome.toLowerCase() === nomeProduto.toLowerCase());

    if (!produtoNoEstoque) {
        console.log(`\nErro: Produto '${nomeProduto}' não encontrado no estoque.\n`);
        return;
    }

    const quantidadeVendida = parseInt(prompt(`Digite a quantidade de '${nomeProduto}' vendida: `));

    if (isNaN(quantidadeVendida) || quantidadeVendida <= 0) {
        console.log("\nErro: A quantidade deve ser um número inteiro positivo.\n");
        return;
    }

    if (quantidadeVendida > produtoNoEstoque.quantidade) {
        console.log(`\nErro: Venda não realizada. Estoque insuficiente.`);
        console.log(`Quantidade disponível de '${produtoNoEstoque.nome}': ${produtoNoEstoque.quantidade}\n`);
        return;
    }

    // Realiza a venda
    produtoNoEstoque.quantidade -= quantidadeVendida;
    const valorVenda = quantidadeVendida * produtoNoEstoque.preco;
    receitaTotal += valorVenda;

    // Registra na lista de vendas do dia
    const produtoVendido = vendas.find(p => p.nome.toLowerCase() === nomeProduto.toLowerCase());
    if (produtoVendido) {
        produtoVendido.quantidade += quantidadeVendida;
    } else {
        vendas.push({ nome: produtoNoEstoque.nome, quantidade: quantidadeVendida });
    }
    
    console.log(`\nVenda registrada com sucesso! Valor: R$ ${valorVenda.toFixed(2)}\n`);
}

/**
 * Mostra um relatório final com as vendas, receita e estoque restante.
 */
function exibirRelatorio() {
    console.log("\n--- RELATÓRIO FINAL DO DIA ---");
    
    console.log("\n[+] Produtos Vendidos:");
    if (vendas.length === 0) {
        console.log("Nenhuma venda registrada hoje.");
    } else {
        vendas.forEach(produto => {
            console.log(`  - Produto: ${produto.nome} | Quantidade Vendida: ${produto.quantidade}`);
        });
    }

    console.log(`\n[+] Receita Total do Dia: R$ ${receitaTotal.toFixed(2)}`);
    
    console.log("\n[+] Estoque Restante:");
    listarEstoque(); // Reutiliza a função de listar o estoque
}


// --- Função Principal (Menu) ---

function main() {
    while (true) {
        console.log("--- SISTEMA DE PADARIA (Array Version) ---");
        console.log("1. Listar estoque");
        console.log("2. Consultar produto");
        console.log("3. Adicionar produto");
        console.log("4. Remover produto");
        console.log("5. Registrar venda");
        console.log("6. Relatório final");
        console.log("0. Sair");
        
        const opcao = prompt("Digite o número da opção desejada: ");

        switch (opcao) {
            case '1': listarEstoque(); break;
            case '2': consultarProduto(); break;
            case '3': adicionarProduto(); break;
            case '4': removerProduto(); break;
            case '5': registrarVenda(); break;
            case '6': exibirRelatorio(); break;
            case '0':
                console.log("\nSaindo do sistema. Até logo!");
                return;
            default:
                console.log("\nOpção inválida! Por favor, escolha uma opção do menu.\n");
        }
    }
}

main();