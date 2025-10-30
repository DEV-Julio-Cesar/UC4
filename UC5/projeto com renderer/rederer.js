
        let currentOperation = null
        let firstOperand = null

        function appendNumber(number) {
            document.getElementById('display').value += number
        }

        function setOperation(operator) {
            firstOperand = Number(document.getElementById('display').value)
            currentOperation = operator 
            document.getElementById('display').value = ''
        }

        function calculateResult() {
            const secondOperand = Number(document.getElementById('display').value)
            let result
            switch (currentOperation) {
                case '+':
                    result = `${window.api.soma(firstOperand,secondOperand)}`
                    break;
                case '-':
                    result = `${window.api.subtracao(firstOperand,secondOperand)}`
                    break;
                case '*':
                    result = `${window.api.multiplicacao(firstOperand,secondOperand)}`
                    break;
                case '/':
                    result = `${window.api.divicao(firstOperand,secondOperand)}`
                    break;
                default:
                    return;
            }
            document.getElementById('display').value = result
            currentOperation = null
            firstOperand = null
        }

        function clearDisplay() {
            document.getElementById('display').value = ''
            currentOperation = null
            firstOperand = null
        }