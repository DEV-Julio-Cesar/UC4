// renderer.js CORRIGIDO
const guessInput = document.getElementById('guessInput');
const messageElement = document.getElementById('message');
const attemptsElement = document.getElementById('attempts');
const hintMessageElement = document.getElementById('hintMessage');
const hintButton = document.getElementById('hintBtn');

let lastHint = '';
let isGameOver = false;

// 1. Envolve a inicialização do jogo para garantir que a API esteja pronta
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o jogo SOMENTE APÓS o DOM ser carregado
    if (window.gameApi) {
        window.gameApi.resetGame(); // Usa resetGame para garantir que a UI seja resetada corretamente
        updateUI({
            attempts: 0, 
            message: 'Tente adivinhar o novo número!', 
            result: 'reset'
        });
    } else {
        console.error("Erro: window.gameApi não foi exposta pelo preload.js.");
    }
});


function updateUI(data) {
    attemptsElement.textContent = `Tentativas: ${data.attempts}`;
    
    // Atualiza a mensagem
    messageElement.textContent = data.message;
    messageElement.className = ''; 
    hintMessageElement.style.display = 'none';

    if (data.result === 'win') {
        // Se acertou
        messageElement.classList.add('win');
        messageElement.textContent = `🎉 ${data.message} Você acertou em ${data.attempts} tentativas!`;
        isGameOver = true;
        hintButton.style.display = 'none';
        guessInput.disabled = true;

        // Adiciona um botão para Novo Jogo
        const newGameBtn = document.createElement('button');
        newGameBtn.textContent = 'Novo Jogo';
        newGameBtn.onclick = startNewGame;
        newGameBtn.style.backgroundColor = '#00bcd4';
        newGameBtn.style.color = 'white';
        newGameBtn.style.marginLeft = '10px';
        messageElement.appendChild(newGameBtn);

    } else if (data.result === 'lose') {
        // Se errou
        messageElement.classList.add('lose');
        
        // Verifica se a dica existe antes de atribuir, garantindo a compatibilidade
        lastHint = data.hint ? `O número é ${data.hint}.` : 'O palpite estava incorreto.';
        
        // Torna o botão Dica visível após o primeiro erro
        if (data.attempts > 0) {
            hintButton.style.display = 'inline-block';
        }
    } else if (data.result === 'invalid') {
        // Palpite inválido
        messageElement.classList.add('lose');
    }
}

function checkGuess() {
    if (isGameOver) return;
    if (!window.gameApi) return console.error("API do jogo não está disponível.");

    const guess = guessInput.value;
    // Chama a função exposta pelo preload
    const data = window.gameApi.checkGuess(guess);
    updateUI(data);
}

function clearInput() {
    guessInput.value = '';
}

function showHint() {
    if (isGameOver) return;
    
    if (lastHint) {
        hintMessageElement.textContent = `DICA: ${lastHint}`;
        hintMessageElement.style.display = 'block';
    } else {
        hintMessageElement.textContent = `Aguarde um primeiro palpite errado para obter uma dica!`;
        hintMessageElement.style.display = 'block';
    }
}

function startNewGame() {
    if (!window.gameApi) return console.error("API do jogo não está disponível.");
    
    // Reseta o jogo através do preload
    const data = window.gameApi.resetGame()
    isGameOver = false;
    guessInput.value = '';
    guessInput.disabled = false;
    lastHint = '';
    
    // Reseta o estado da UI
    updateUI({
        attempts: data.attempts, 
        message: 'Tente adivinhar o novo número!', 
        result: 'reset'
    });
    
    // Garante que o botão Dica e a mensagem de dica sumam
    hintButton.style.display = 'none';
    hintMessageElement.style.display = 'none';
}

// Expõe funções globais para o HTML (Isso deve funcionar se o script for carregado)
window.checkGuess = checkGuess;
window.clearInput = clearInput;
window.showHint = showHint;