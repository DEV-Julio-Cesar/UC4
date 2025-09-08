import promptSync from "prompt-sync";
const prompt = promptSync();

// Exemplo de histórico de mensagens
let mensagens = [
  "Oi",
  "Tudo bem?",
  "Como vai o trabalho?",
  "Já terminou o relatório?",
  "Não esquece da reunião amanhã",
  "Boa noite!",
  "Bom dia!",
  "Vai almoçar onde?",
  "Estou chegando",
  "Beleza!",
  "Partiu viagem",
  "Cheguei em casa",
  "Assistindo série",
  "Até amanhã",
  "Valeu!"
];

// 1) Pegar as últimas 10 mensagens
let ultimas = mensagens.slice(-10);

// 2) Inverter a ordem (mais novo primeiro)
ultimas = ultimas.reverse();

// 3) Mostrar as mensagens
console.log("📩 Últimas 10 mensagens (do mais novo para o mais antigo):");
ultimas.forEach((msg, i) => {
  console.log(`${i}: ${msg}`);
});

// 4) Permitir visualizar uma mensagem específica
let pos = parseInt(prompt("Digite a posição da mensagem que deseja ver (0 a 9): "));
if (pos >= 0 && pos < ultimas.length) {
  console.log(`Mensagem escolhida: ${ultimas[pos]}`);
} else {
  console.log("Posição inválida!");
}

// 5) Juntar tudo em uma string única separada por ---
let unicaString = ultimas.join(" --- ");
console.log("\n📜 String única com todas as mensagens:");
console.log(unicaString);
