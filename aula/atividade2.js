import promptSync from "prompt-sync";
const prompt = promptSync();

// Funções
const basica = {
  soma: (a, b) => a + b,
  sub: (a, b) => a - b,
  mult: (a, b) => a * b,
  div: (a, b) => b !== 0 ? a / b : "Erro: divisão por zero"
};

const avancada = {
  sqrt: (a) => Math.sqrt(a),
  pow: (a, b) => Math.pow(a, b)
};

// Menu principal
function menuPrincipal() {
  console.log("\n=== MENU PRINCIPAL ===");
  console.log("1) Calculadora Básica");
  console.log("2) Calculadora Avançada");
  console.log("0) Sair\n");
}

// Menu básica
function menuBasica() {
  console.log("\n=== CALCULADORA BÁSICA ===");
  console.log("1) Soma (+)");
  console.log("2) Subtração (-)");
  console.log("3) Multiplicação (*)");
  console.log("4) Divisão (/)");
  console.log("0) Voltar\n");
}

// Menu avançada
function menuAvancada() {
  console.log("\n=== CALCULADORA AVANÇADA ===");
  console.log("1) Raiz Quadrada (√)");
  console.log("2) Potenciação (x^y)");
  console.log("0) Voltar\n");
}

// Calculadora básica
function calculadoraBasica() {
  while (true) {
    menuBasica();
    const op = prompt("Escolha a operação: ");

    if (op === "0") break;

    let a = parseFloat(prompt("Digite o primeiro número: "));
    let b = parseFloat(prompt("Digite o segundo número: "));

    switch (op) {
      case "1": console.log("Resultado:", basica.soma(a, b)); break;
      case "2": console.log("Resultado:", basica.sub(a, b)); break;
      case "3": console.log("Resultado:", basica.mult(a, b)); break;
      case "4": console.log("Resultado:", basica.div(a, b)); break;
      default: console.log("Opção inválida.");
    }
  }
}

// Calculadora avançada
function calculadoraAvancada() {
  while (true) {
    menuAvancada();
    const op = prompt("Escolha a operação: ");

    if (op === "0") break;

    if (op === "1") {
      let a = parseFloat(prompt("Digite o número: "));
      console.log("Resultado:", avancada.sqrt(a));
    } else if (op === "2") {
      let a = parseFloat(prompt("Digite a base: "));
      let b = parseFloat(prompt("Digite o expoente: "));
      console.log("Resultado:", avancada.pow(a, b));
    } else {
      console.log("Opção inválida.");
    }
  }
}

// Principal
function main() {
  while (true) {
    menuPrincipal();
    const escolha = prompt("Escolha a calculadora: ");

    switch (escolha) {
      case "1": calculadoraBasica(); break;
      case "2": calculadoraAvancada(); break;
      case "0": 
        console.log("Encerrando...");
        process.exit();
      default:
        console.log("Opção inválida.");
    }
  }
}

main();
