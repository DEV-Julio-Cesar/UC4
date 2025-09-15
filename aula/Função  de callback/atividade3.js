import promptSync from 'prompt-sync'
const prompt = promptSync()

// Dados Iniciais do Hospital (NECESSÁRIO PARA O CÓDIGO FUNCIONAR)
const nomesPacientes = ["Carlos", "Fernanda", "João", "Mariana", "Pedro"];
const idadesPacientes = [45, 32, 78, 11, 60];
const alasPacientes = ["Cardiologia", "Ortopedia", "UTI", "Pediatria", "UTI"];
const statusPacientes = ["Internado", "Alta", "Internado", "Internado", "Alta"];

// 1. Listar apenas os pacientes internados.
// Usando o método filter() para criar um novo array de pacientes com base no status.
console.log("--- Pacientes Internados ---")
let pacientesInternados = nomesPacientes.filter((nome, indice) => {
    return statusPacientes[indice] === "Internado";
})
console.log(pacientesInternados) // Saída: [ 'Carlos', 'João', 'Mariana' ]


// 2. Calcular a média de idade dos pacientes internados.
// Usando filter() para pegar as idades dos internados e reduce() para somá-las e calcular a média.
console.log("\n--- Média de idade dos pacientes internados ---")
const idadesInternados = idadesPacientes.filter((idade, indice) => {
    return statusPacientes[indice] === "Internado";
});
const mediaIdadeInternados = idadesInternados.reduce((acc, idade) => acc + idade, 0) / idadesInternados.length;
console.log(`${mediaIdadeInternados.toFixed(2)} anos`) // Saída: 43.67 anos


// 3. Localize um paciente pelo nome digitado.
// Usando o método find() para localizar um paciente pelo nome.
console.log("\n--- Localizar paciente 'João' ---")
const nomePacienteBusca = "João";
const indicePaciente = nomesPacientes.findIndex(nome => nome === nomePacienteBusca);
if (indicePaciente !== -1) {
    const pacienteInfo = {
        nome: nomesPacientes[indicePaciente],
        idade: idadesPacientes[indicePaciente],
        ala: alasPacientes[indicePaciente],
        status: statusPacientes[indicePaciente]
    };
    console.log(pacienteInfo);
} else {
    console.log("Paciente não encontrado.");
}


// 4. Verifique se existe algum paciente na ala de UTI.
// Usando o método some() para verificar a existência de pelo menos um caso.
console.log("\n--- Existe algum paciente na UTI? ---");
const temPacienteUTI = alasPacientes.some(ala => ala === "UTI")
console.log(temPacienteUTI ? "Sim, existe." : "Não, não existe.") 

// 5. Verifique se todos os pacientes internados têm idade maior que 12 anos.
// Usando filter() para obter os internados e every() para checar a idade de todos.
console.log("\n--- Todos os pacientes internados têm mais de 12 anos? ---")
const internadosMaiores12 = idadesPacientes
    .filter((idade, indice) => statusPacientes[indice] === "Internado")
    .every(idade => idade > 12);
console.log(internadosMaiores12 ? "Sim, todos." : "Não.") // Saída: Não.