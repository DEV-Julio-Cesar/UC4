import promptSync from 'prompt-sync'
const prompt = promptSync()

// let nomes = ["Ana Clara Sousa", "Bruno Oliveira","Carlos Pereira","Daniela Ferreira","Eduardo Alves","Fernanda Lima","Gabriel Martins","Helena Rocha" ,"Igor Barbosa", "Júlia Castro"]
// let notas = [8.7,6.5,9.2,7.8,5.4,8.0,7.1,9.8,6.9,8.5]
// let status = ["ativo","ativo", "inativo", "inativo", "ativo", "inativo","ativo","ativo", "inativo", "inativo" ]
// let media = []


// let maior7 = notas.filter((nota) => >= 7)
// console.log(maior7)

// let menor4 = notas.filter((nota) => <= 4)
// console.log(menor4)

// --- Dados Iniciais ---
const nomes = [
    "Ana Silva", "Bruno Costa", "Carla Dias", "Daniel Almeida", "Elisa Ferreira",
    "Felipe Matos", "Gabriela Lima", "Hugo Pereira"
];
const notas = [
    [8.5, 9.0, 7.5], [5.0, 6.5, 4.5], [9.5, 10.0, 9.0], [7.0, 7.0, 7.0],
    [3.0, 4.0, 3.5], [8.0, 7.5, 8.5], [10.0, 9.5, 9.0], [6.0, 7.5, 5.5]
];
const statusMatricula = [
    "Ativo", "Ativo", "Inativo", "Ativo", "Ativo",
    "Inativo", "Ativo", "Ativo"
];

// --- Funções Assíncronas (retornam Promises) ---

// 1. Cria um novo array com o nome e a média de cada aluno.
function gerarAlunosComMedia() {
    return new Promise((resolve) => {
        const alunosComMedia = nomes.map((nome, index) => {
            const media = notas[index].reduce((soma, nota) => soma + nota, 0) / notas[index].length;
            return {
                nome: nome,
                media: parseFloat(media.toFixed(2))
            };
        });
        resolve(alunosComMedia);
    });
}

// 2. Mostra apenas os alunos com média maior ou igual a 7.
function filtrarAlunosAprovados(alunos) {
    return new Promise((resolve) => {
        const aprovados = alunos.filter(aluno => aluno.media >= 7);
        resolve(aprovados);
    });
}

// 3. Calcula a média geral da turma.
function calcularMediaGeral(alunos) {
    return new Promise((resolve) => {
        const somaDasMedias = alunos.reduce((soma, aluno) => soma + aluno.media, 0);
        const mediaGeral = somaDasMedias / alunos.length;
        resolve(parseFloat(mediaGeral.toFixed(2)));
    });
}

// 4. Localiza um aluno específico pelo nome.
function localizarAluno(nomePesquisado) {
    return new Promise((resolve, reject) => {
        const indexDoAluno = nomes.findIndex(nome => nome.toLowerCase() === nomePesquisado.toLowerCase());

        if (indexDoAluno !== -1) {
            const mediaDoAluno = parseFloat((notas[indexDoAluno].reduce((soma, nota) => soma + nota, 0) / notas[indexDoAluno].length).toFixed(2));
            const alunoInfo = {
                nome: nomes[indexDoAluno],
                notas: notas[indexDoAluno],
                media: mediaDoAluno,
                status: statusMatricula[indexDoAluno]
            };
            resolve(alunoInfo);
        } else {
            reject(`Aluno '${nomePesquisado}' não foi encontrado.`);
        }
    });
}

// 5. Verifica se todos os alunos estão ativos.
function verificarTodosAlunosAtivos() {
    return new Promise((resolve) => {
        const todosAtivos = statusMatricula.every(status => status === "Ativo");
        resolve(todosAtivos);
    });
}

// 6. Verifica se existe algum aluno com média abaixo de 4.
function verificarMediaAbaixoDeQuatro(alunos) {
    return new Promise((resolve) => {
        const existeMediaBaixa = alunos.some(aluno => aluno.media < 4);
        resolve(existeMediaBaixa);
    });
}


// --- Função Principal para Orquestrar as Chamadas ---
async function executarOperacoes() {
    try {
        console.log("--- 1. Alunos e suas Médias ---");
        const alunosComMedia = await gerarAlunosComMedia();
        console.table(alunosComMedia);

        console.log("\n--- 2. Alunos Aprovados (Média >= 7) ---");
        const aprovados = await filtrarAlunosAprovados(alunosComMedia);
        console.table(aprovados);

        console.log("\n--- 3. Média Geral da Turma ---");
        const mediaGeral = await calcularMediaGeral(alunosComMedia);
        console.log(`A média geral da turma é: ${mediaGeral}`);

        console.log("\n--- 4. Localizar Aluno ---");
        const aluno = await localizarAluno("Daniel Almeida");
        console.log("Aluno encontrado:", aluno);

        console.log("\n--- 5. Verificação de Status 'Ativo' ---");
        const todosAtivos = await verificarTodosAlunosAtivos();
        console.log(todosAtivos ? "Sim, todos os alunos estão ativos." : "Não, existem alunos inativos.");

        console.log("\n--- 6. Verificação de Média Baixa (< 4.0) ---");
        const haMediaBaixa = await verificarMediaAbaixoDeQuatro(alunosComMedia);
        console.log(haMediaBaixa ? "Sim, existe pelo menos um aluno com média abaixo de 4.0." : "Não há alunos com média abaixo de 4.0.");

    } catch (error) {
        console.error("Ocorreu um erro:", error);
    }
}

// Inicia a execução do programa
executarOperacoes();
