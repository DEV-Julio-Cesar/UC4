import promptSync from 'prompt-sync'
const prompt = promptSync()

// // Dados Iniciais do Hospital (NECESSÁRIO PARA O CÓDIGO FUNCIONAR)
// const nomesPacientes = ["Carlos", "Fernanda", "João", "Mariana", "Pedro"];
// const idadesPacientes = [45, 32, 78, 11, 60];
// const alasPacientes = ["Cardiologia", "Ortopedia", "UTI", "Pediatria", "UTI"];
// const statusPacientes = ["Internado", "Alta", "Internado", "Internado", "Alta"];

// // 1. Listar apenas os pacientes internados.
// // Usando o método filter() para criar um novo array de pacientes com base no status.
// console.log("--- Pacientes Internados ---")
// let pacientesInternados = nomesPacientes.filter((nome, indice) => {
//     return statusPacientes[indice] === "Internado";
// })
// console.log(pacientesInternados) // Saída: [ 'Carlos', 'João', 'Mariana' ]


// // 2. Calcular a média de idade dos pacientes internados.
// // Usando filter() para pegar as idades dos internados e reduce() para somá-las e calcular a média.
// console.log("\n--- Média de idade dos pacientes internados ---")
// const idadesInternados = idadesPacientes.filter((idade, indice) => {
//     return statusPacientes[indice] === "Internado";
// });
// const mediaIdadeInternados = idadesInternados.reduce((acc, idade) => acc + idade, 0) / idadesInternados.length;
// console.log(`${mediaIdadeInternados.toFixed(2)} anos`) // Saída: 43.67 anos


// // 3. Localize um paciente pelo nome digitado.
// // Usando o método find() para localizar um paciente pelo nome.
// console.log("\n--- Localizar paciente 'João' ---")
// const nomePacienteBusca = "João";



// const indicePaciente = nomesPacientes.findIndex(nome => nome === nomePacienteBusca);
// if (indicePaciente !== -1) {
//     const pacienteInfo = {
//         nome: nomesPacientes[indicePaciente],
//         idade: idadesPacientes[indicePaciente],
//         ala: alasPacientes[indicePaciente],
//         status: statusPacientes[indicePaciente]
//     };
//     console.log(pacienteInfo);
// } else {
//     console.log("Paciente não encontrado.");
// }


// // 4. Verifique se existe algum paciente na ala de UTI.
// // Usando o método some() para verificar a existência de pelo menos um caso.
// console.log("\n--- Existe algum paciente na UTI? ---");
// const temPacienteUTI = alasPacientes.some(ala => ala === "UTI")
// console.log(temPacienteUTI ? "Sim, existe." : "Não, não existe.") 

// // 5. Verifique se todos os pacientes internados têm idade maior que 12 anos.
// // Usando filter() para obter os internados e every() para checar a idade de todos.
// console.log("\n--- Todos os pacientes internados têm mais de 12 anos? ---")
// const internadosMaiores12 = idadesPacientes
//     .filter((idade, indice) => statusPacientes[indice] === "Internado")
//     .every(idade => idade > 12);
// console.log(internadosMaiores12 ? "Sim, todos." : "Não.") // Saída: Não.

// --- Dados Iniciais do Hospital ---
const nomes = [
    "Carlos Andrade", "Mariana Rios", "Felipe Arruda", "Joana Medeiros", 
    "Lucas Tavares", "Beatriz Viana", "Ricardo Gomes", "Sofia Costa"
];
const idades = [45, 22, 11, 68, 33, 7, 52, 29];
const alas = ["Cardiologia", "Ortopedia", "Pediatria", "UTI", "Clínica Geral", "Pediatria", "UTI", "Ortopedia"];
const statusPacientes = ["Internado", "Alta", "Internado", "Internado", "Alta", "Internado", "Internado", "Alta"];

// --- Função Principal que Prepara os Dados e Executa o Callback ---

/**
 * Processa os dados dos pacientes e executa uma operação específica via callback.
 * @param {function} callback - A função que será executada. Ela recebe um array de objetos de pacientes.
 * @param {*} args - Argumentos adicionais que o callback possa precisar (ex: nome para busca).
 */
function processarPacientes(callback, ...args) {
    // 1. Unifica os arrays em uma estrutura de dados mais rica (array de objetos)
    const pacientes = nomes.map((nome, index) => ({
        nome: nome,
        idade: idades[index],
        ala: alas[index],
        status: statusPacientes[index]
    }));

    // 2. Executa o callback, passando a lista unificada de pacientes e outros argumentos
    console.log(`\n--- ${callback.name} ---`);
    callback(pacientes, ...args);
}


// --- Definição das Funções de Callback (Cada uma realiza uma tarefa) ---

/**
 * Callback para listar apenas os pacientes internados.
 * @param {Array<object>} pacientes - A lista completa de pacientes.
 */
function listarPacientesInternados(pacientes) {
    const internados = pacientes.filter(p => p.status === 'Internado');
    console.log("Pacientes atualmente internados:");
    console.table(internados);
}

/**
 * Callback para calcular a média de idade dos pacientes internados.
 * @param {Array<object>} pacientes - A lista completa de pacientes.
 */
function calcularMediaIdadeInternados(pacientes) {
    const internados = pacientes.filter(p => p.status === 'Internado');
    if (internados.length === 0) {
        console.log("Não há pacientes internados para calcular a média.");
        return;
    }
    const somaDasIdades = internados.reduce((soma, p) => soma + p.idade, 0);
    const media = somaDasIdades / internados.length;
    console.log(`A média de idade dos pacientes internados é: ${media.toFixed(2)} anos.`);
}

/**
 * Callback para localizar um paciente específico pelo nome.
 * @param {Array<object>} pacientes - A lista completa de pacientes.
 * @param {string} nome - O nome do paciente a ser localizado.
 */
function localizarPacientePorNome(pacientes, nome) {
    if (!nome) {
        console.log("Nome para busca não foi fornecido.");
        return;
    }
    const pacienteEncontrado = pacientes.find(p => p.nome.toLowerCase() === nome.toLowerCase());
    if (pacienteEncontrado) {
        console.log(`Paciente '${nome}' encontrado:`);
        console.log(pacienteEncontrado);
    } else {
        console.log(`Paciente '${nome}' não foi encontrado.`);
    }
}

/**
 * Callback para verificar se existe algum paciente na UTI.
 * @param {Array<object>} pacientes - A lista completa de pacientes.
 */
function verificarPacienteNaUTI(pacientes) {
    const temPacienteNaUTI = pacientes.some(p => p.ala === 'UTI');
    if (temPacienteNaUTI) {
        console.log("Sim, existe pelo menos um paciente na ala de UTI.");
    } else {
        console.log("Não, não há pacientes na ala de UTI no momento.");
    }
}

/**
 * Callback para verificar se todos os internados são maiores de 12 anos.
 * @param {Array<object>} pacientes - A lista completa de pacientes.
 */
function verificarIdadeDosInternados(pacientes) {
    const internados = pacientes.filter(p => p.status === 'Internado');
    const todosMaioresQue12 = internados.every(p => p.idade > 12);
    if (todosMaioresQue12) {
        console.log("Sim, todos os pacientes internados têm idade maior que 12 anos.");
    } else {
        console.log("Não, existe pelo menos um paciente internado com 12 anos ou menos.");
    }
}


// --- Execução das Tarefas Usando a Função Principal e os Callbacks ---

processarPacientes(listarPacientesInternados);
processarPacientes(calcularMediaIdadeInternados);
processarPacientes(localizarPacientePorNome, "Joana Medeiros"); // Passa um argumento extra para o callback
processarPacientes(verificarPacienteNaUTI);
processarPacientes(verificarIdadeDosInternados);