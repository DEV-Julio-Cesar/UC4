     function pegaNome(){
                let conteudo = document.getElementById("nome").value
                alert(`Olá, ${conteudo}! Julio Arrasa`)
                document.getElementById('nome').value = ""
                document.getElementById('texto').innerText = `Olá, ${conteudo}! Julio Arrasa`
            }
            function limparCampo(){
                document.getElementById('nome').value = ""
                 document.getElementById('numero').value = ""
            }
            function imparOuPar(){
                let conteudo = document.getElementById("numero").value
                if (isNaN(conteudo)){
                    alert(`Isso não é um número!`)
                }else if(conteudo % 2 == 0 ){
                    alert(`O número é par!`)
                } else {
                    alert (`O número é ímpar!`)
                }
                document.getElementById('numero').value = ""

            } 
            function possitivoOuNegativo(){
                let conteudo = Number( document.getElementById("numero")).value
                if (isNaN(conteudo)){
                    alert(`Isso não é um número!`)
                }else if (conteudo >= 0){
                    alert(`O número é positivo!`)
                } else {
                    alert (`O número é negativo!`)
                }
                document.getElementById('numero').value = ""

            } 
            function verificarNumero(){
                let conteudo = document.getElementById("numero").value
                if (isNaN(conteudo)){
                    alert(`Isso não é um número!`)
                } else {
                    alert (`Obrigado por inserir um número!`)
                }
                document.getElementById('numero').value = ""

            }
            function calcularNotas(){

                let nota1 = parseFloat(document.getElementById("numero1").value)
                let nota2 = parseFloat(document.getElementById("numero2").value)
                let media = (nota1*0.4 ) + ( nota2*0.6)
                alert(`A média das notas é: ${media.toFixed(2)}`)
                    document.getElementById('resultado').innerText = `A média das notas é: ${media.toFixed(2)}`

            }
            function caulcularFahrenheit(){
                let celsius = parseFloat(document.getElementById("celsius").value)
                let fahrenheit = (celsius * 9/5) + 32
                alert(`A temperatura em Fahrenheit é: ${fahrenheit.toFixed(2)}°F`)
                document.getElementById('fahrenheit').innerText = `A temperatura em Fahrenheit é: ${fahrenheit.toFixed(2)}°F`
            }
            function calcularKelvin(){
                let celsius = parseFloat(document.getElementById("celsius").value)
                let kelvin = celsius + 273.15
                alert(`A temperatura em Kelvin é: ${kelvin.toFixed(2)}K`)
                document.getElementById('kelvin').innerText = `A temperatura em Kelvin é: ${kelvin.toFixed(2)}K`
            }
