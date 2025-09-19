

// 1. CONFIGURAÇÃO INICIAL
import promptSync from 'prompt-sync'
const prompt = promptSync()

// Constantes para fácil manutenção
const NUM_ENFERMARIAS = 5;
const NUM_LEITOS_POR_ENFERMARIA = 7;
const LIVRE = 'L';
const OCUPADO = 'O';

// Cria a matriz 5x7 e preenche todos os leitos como Livres ('L')
const leitos = [];
for (let i = 0; i < NUM_ENFERMARIAS; i++) {
    // Para cada enfermaria, cria um array de leitos
    leitos[i] = [];
    for (let j = 0; j < NUM_LEITOS_POR_ENFERMARIA; j++) {
        leitos[i][j] = LIVRE;
    }
}

// 2. FUNÇÕES DO SISTEMA

/**
 * Exibe a situação atual de todos os leitos em formato de tabela.
 */
function visualizarLeitos() {
    console.log("\n--- Situação Atual dos Leitos ---");
    // Adiciona um cabeçalho para as colunas para ficar mais claro
    const leitosComCabecalho = {};
    for (let i = 0; i < NUM_ENFERMARIAS; i++) {
        // O nome da linha será "Enfermaria 1", "Enfermaria 2", etc.
        leitosComCabecalho[`Enfermaria ${i + 1}`] = leitos[i];
    }
    console.table(leitosComCabecalho);
    console.log("Legenda: L = Livre, O = Ocupado");
}

/**
 * Gerencia o processo de internação de um paciente.
 */
function internarPaciente() {
    console.log("\n--- Internar Paciente ---");
    visualizarLeitos(); // Mostra a situação antes de perguntar

    // Obtém e valida a enfermaria
    const enfermariaStr = prompt(`Digite o número da enfermaria (1 a ${NUM_ENFERMARIAS}): `);
    const enfermariaEscolhida = parseInt(enfermariaStr, 10);

    // Converte o número da enfermaria (1-5) para o índice do array (0-4)
    const indiceEnfermaria = enfermariaEscolhida - 1;

    // Validação da entrada da enfermaria
    if (isNaN(enfermariaEscolhida) || indiceEnfermaria < 0 || indiceEnfermaria >= NUM_ENFERMARIAS) {
        console.log("Erro: Enfermaria inválida. Tente novamente.");
        return;
    }

    // Obtém e valida o leito
    const leitoStr = prompt(`Digite o número do leito (1 a ${NUM_LEITOS_POR_ENFERMARIA}): `);
    const leitoEscolhido = parseInt(leitoStr, 10);
    const indiceLeito = leitoEscolhido - 1;

    // Validação da entrada do leito
    if (isNaN(leitoEscolhido) || indiceLeito < 0 || indiceLeito >= NUM_LEITOS_POR_ENFERMARIA) {
        console.log("Erro: Leito inválido. Tente novamente.");
        return;
    }

    // Verifica se o leito já está ocupado
    if (leitos[indiceEnfermaria][indiceLeito] === OCUPADO) {
        console.log("\n!!! ATENÇÃO: Este leito já está ocupado. A operação foi cancelada. !!!");
        visualizarLeitos(); // Mostra novamente a situação
    } else {
        // Ocupa o leito
        leitos[indiceEnfermaria][indiceLeito] = OCUPADO;
        console.log(`\n>>> Paciente internado com sucesso na Enfermaria ${enfermariaEscolhida}, Leito ${leitoEscolhido}.`);
    }
}

/**
 * Gera e exibe um relatório com a contagem de leitos livres e ocupados por enfermaria.
 */
function gerarRelatorio() {
    console.log("\n--- Relatório de Ocupação ---");
    for (let i = 0; i < NUM_ENFERMARIAS; i++) {
        // Usa o método filter para contar de forma simples e eficiente
        const ocupados = leitos[i].filter(leito => leito === OCUPADO).length;
        const livres = leitos[i].filter(leito => leito === LIVRE).length;
        // const livres = NUM_LEITOS_POR_ENFERMARIA - ocupados; // Alternativa mais rápida

        console.log(`Enfermaria ${i + 1}: ${ocupados} leitos ocupados, ${livres} leitos livres.`);
    }
}


// 3. LOOP PRINCIPAL DO PROGRAMA (MENU)
function iniciarGerenciamento() {
    while (true) {
        console.log("\n=====================================");
        console.log("   Gerenciamento de Leitos - Hospital Santa Catarina   ");
        console.log("=====================================");
        console.log("1. Visualizar Leitos");
        console.log("2. Internar Paciente");
        console.log("3. Gerar Relatório de Ocupação");
        console.log("4. Sair do Sistema");
        const opcao = prompt("Escolha uma opção: ");

        switch (opcao) {
            case '1':
                visualizarLeitos();
                break;
            case '2':
                internarPaciente();
                break;
            case '3':
                gerarRelatorio();
                break;
            case '4':
                console.log("Encerrando o sistema. Obrigado!");
                return; // Sai da função e encerra o loop
            default:
                console.log("Opção inválida. Por favor, escolha uma das opções do menu.");
                break;
        }
        prompt("\nPressione ENTER para continuar..."); // Pausa para o usuário ler a saída
    }
}

// Inicia o programa
iniciarGerenciamento();