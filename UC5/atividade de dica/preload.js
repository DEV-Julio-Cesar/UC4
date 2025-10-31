// preload.js
const { contextBridge } = require('electron');

// --- Variáveis de Estado do Jogo ---
let secretNumber = 0
let attempts = 0

// Gera um número aleatório entre 1 e 100 e reseta as tentativas
function generateRandomNumber() {
    secretNumber = Math.floor(Math.random() * 100) + 1
    attempts = 0
    return true
}
// let botao = document.querySelectorALL('button')
// botao.addEventListener('click', () => {
//     if(botao.className === 'num'){
//         visor.value += botao.textContent.trim()
//     }else if(botao.className === 'op'){
//         visor.value += botao.textContent
//         op = botao.textContent.trim()
//     }console.log(op)
// } else if(botao.id === 'igual'){
//     document.getElementById('dica').style.visibility = 'visible'
//     let conteudo = visor.value.split(op)
//     switch(op){
//         case '+':
//             visor.value = parseFloat(conteudo[0]) + parseFloat(conteudo[1])
//             break
//         case '-':
//             visor.value = parseFloat(conteudo[0]) - parseFloat(conteudo[1])
//             break
//         case '*':
//             visor.value = parseFloat(conteudo[0]) * parseFloat(conteudo[1])
//             break
//         case '/':
//             if(conteudo[1] == 0){
//                 visor.value = 'Erro'
//             }else{
//                 visor.value = parseFloat(conteudo[0]) / parseFloat(conteudo[1])
//             }
//             break
//     }
//     updateDisplayColor(visor.value)
// })


// Verifica o palpite do usuário
function checkGuess(guess) {
    // Garante que o número secreto foi gerado
    if (secretNumber === 0) {
        generateRandomNumber();
    }
    
    attempts++

    // Verifica se o palpite é válido
    const parsedGuess = parseInt(guess, 10);
    if (isNaN(parsedGuess) || parsedGuess < 1 || parsedGuess > 100) {
        return { result: 'invalid', message: 'Digite um número válido entre 1 e 100.', attempts: attempts }
    }

    if (parsedGuess === secretNumber) {
        // Acertou
        return { 
            result: 'win', 
            message: `Parabéns! Você acertou o número ${secretNumber}!`, 
            attempts: attempts,
            gameOver: true
        };
    } else {
        // Errou
        return { 
            result: 'lose', 
            message: 'Tente novamente.', 
            attempts: attempts,
            hint: (parsedGuess < secretNumber) ? 'Maior' : 'Menor',
            gameOver: false
        };
    }
}

// Fornece a dica (maior ou menor)
function getHint() {
    if (secretNumber === 0) return 'O jogo não foi iniciado.';
    // A dica real é gerada dentro de checkGuess, mas essa função expõe o valor
    // de forma segura sem expor o secretNumber.
    return 'Dica disponível após o primeiro erro de palpite.';
}

// Expõe as funções para a janela de renderização (renderer)
contextBridge.exposeInMainWorld('gameApi', {
    generateRandomNumber: generateRandomNumber,
    checkGuess: checkGuess,
    getHint: getHint,
    // Função utilitária para resetar e iniciar novo jogo pelo renderer
    resetGame: () => {
        generateRandomNumber();
        return { attempts: 0, message: '', hint: '', gameOver: false };
    }
});