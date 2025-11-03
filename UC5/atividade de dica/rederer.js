// renderer.js
const guessInput = document.getElementById('guessInput');
const messageElement = document.getElementById('message');
const attemptsElement = document.getElementById('attempts');
const hintMessageElement = document.getElementById('hintMessage');
const hintButton = document.getElementById('hintBtn');

let lastHint = '';
let isGameOver = false;

// Inicializa o jogo ao carregar o script
window.gameApi.generateRandomNumber();


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
        lastHint = `O número é ${data.hint}.`;
        
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
    }
}

function startNewGame() {
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

// Expõe funções globais para o HTML
window.checkGuess = checkGuess;
window.clearInput = clearInput;
window.showHint = showHint;

function mudarTema() {
    alert("Tema alterado!");
    window.gameApi.tema();
}