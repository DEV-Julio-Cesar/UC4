let currentOperation = null
        let firstOperand = null
        // Captura o elemento do display uma única vez
        const display = document.getElementById('display')

        // NOVA FUNÇÃO: Altera a cor do display com base no valor
        function updateDisplayColor(value) {
            // Remove classes existentes
            display.classList.remove('positive-result', 'negative-result');

            // Converte para número (o resultado da API é um número, mas é bom garantir)
            const numberValue = parseFloat(value);
            
            if (isNaN(numberValue) || value === "Erro") {
                // Se não for um número (ex: erro de divisão por zero), mantém neutro
                return;
            }

            if (numberValue < 0) {
                // Se for negativo, aplica a classe vermelha
                display.classList.add('negative-result');
            } else {
                // Se for positivo ou zero, aplica a classe verde
                display.classList.add('positive-result');
            }
        }

        function appendNumber(number) {
            // Se o display for '0' ou estiver com um resultado anterior, limpa antes de adicionar
            if (display.value === '0' || firstOperand !== null && currentOperation === null) {
                display.value = '';
                // Limpa as classes de cor ao começar um novo cálculo
                display.classList.remove('positive-result', 'negative-result');
            }
            
            // Lógica para evitar múltiplos pontos decimais
            if (number === '.' && display.value.includes('.')) {
                return;
            }

            display.value += number
        }

        function setOperation(operator) {
            firstOperand = Number(display.value)
            currentOperation = operator 
            display.value = ''
        }

        function calculateResult() {
            const secondOperand = Number(display.value)
            let result
            
            if (firstOperand === null || currentOperation === null || display.value === '') {
                return; 
            }

            switch (currentOperation) {
                case '+':
                    result = window.api.soma(firstOperand, secondOperand)
                    break;
                case '-':
                    result = window.api.subtracao(firstOperand, secondOperand)
                    break;
                case '*':
                    result = window.api.multiplicacao(firstOperand, secondOperand)
                    break;
                case '/':
                    // Tratamento para divisão por zero
                    if (secondOperand === 0) {
                        result = "Erro"
                    } else {
                         result = window.api.divicao(firstOperand, secondOperand)
                    }
                    break;
                default:
                    return;
            }
            
            // Atualiza o display com o resultado (convertido para String)
            display.value = String(result)
            
            // CHAMA A LÓGICA DE COR
            updateDisplayColor(result);

            // Prepara o estado para o próximo cálculo
            firstOperand = typeof result === 'number' ? result : null;
            currentOperation = null
        }

        function clearDisplay() {
            display.value = '0'
            currentOperation = null
            firstOperand = null
            // Limpa as classes de cor e permite que o CSS inicial defina o fundo
            display.classList.remove('positive-result', 'negative-result');
        }
        
        // Inicializa o display ao carregar
        if (display) {
             clearDisplay();
        }