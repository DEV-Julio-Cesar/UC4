import PromptSync from "prompt-sync"
const prompt = PromptSync()

class carro {
    #porta
    #modelo
    #pneus // Capacidade total em GB
   

    constructor(porta, modelos, pneus) {
        this.#porta = porta
        this.#modelo = modelo
        this.#pneus = pneus
        
    }
    
    porta(prt) {
        if (this.#porta + prt ) {
            this.#porta += prt
            console.log(` `)
            return true
        } else {
            console.log(` `)
            return false
        }
    }
}
