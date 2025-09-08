// Lista de senhas
let senhas = ["Banco123", "Segura@2025", "senha", "Fraca#", "FORTE!99"];

// Função para verificar se a senha é forte
function verificarSenhas(senhas) {
  // Percorrer cada senha
  for (let i = 0; i < senhas.length; i++) {
    let senha = senhas[i];
    let caracteres = senha.split(""); // transforma em array de caracteres

    // Critérios
    let temNumero = caracteres.some(c => /\d/.test(c));
    let temMaiuscula = caracteres.some(c => /[A-Z]/.test(c));
    let temEspecial = caracteres.some(c => /[@#!%]/.test(c));

    // Se não cumprir todos os critérios, substituir no array original
    if (!(temNumero && temMaiuscula && temEspecial)) {
      senhas[i] = "SENHA FRACA";
    }
  }
  return senhas;
}

// Testando
console.log(verificarSenhas(senhas));
