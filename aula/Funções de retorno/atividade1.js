import promptSync from "prompt-sync";
const prompt = promptSync()

let caminhada
let corrida
let bicicleta

const exercicio = prompt("Digite o exercicio feito: ").toUpperCase()
const tempo = Number(prompt(`Digite o tempo feito `))

function academia (exercicio, tempo) {
    switch (exercicio){
        case "CAMINHADA": 
        caminhada = 5 * tempo    
        console.log(`Sua caminhada de ${tempo} Min Queimou ${caminhada} cal `)
        break

        case "CORRIDA":
            corrida = 10 * tempo  
            console.log(`Sua Corrida de ${tempo} Min Queimou ${corrida} cal `)  
            break

            case "BICICLETA":
                bicicleta = 8 * tempo  
                console.log(`Sua bicicleta de ${tempo} Min Queimou ${bicicleta} cal `)  
                break
    
    }
    }
    academia(exercicio, tempo)


