import PromptSync from "prompt-sync";
const prompt = PromptSync()

//   let pessoa1 = {
//       nome: prompt('Digite seu Nome: '),
//       dataNasc: new Date(prompt('Digite sua data de nascimento AAAA/MM/DD: ')) ,
//       sexo: prompt('Digite seu sexo: '),
//       cpf: prompt('Digite seu CPF: '),
//       mostrarInfo: function(){
//           console.log(`Dados Pessoais: ${pessoa1.nome},${pessoa1.dataNasc.toLocaleString('pt-BR')}`)


//    }
// }

// pessoa1.mostrarInfo()



export class Cliente {
  constructor(nome, cpf, contato) {
    this.nome = nome
    this.cpf = cpf
    this.contato = contato
  }
    mostrarInfo(Cliente) {
        console.log(`Nome: ${this.nome}`)
        console.log(`CPF: ${this.cpf}`)
        console.log(`Contato: ${this.contato}`)
    }
}
export class Quarto {
   constructor(numero, tipo, precoDiaria) {
      this.numero = numero // numero - O número do quarto.
      this.tipo = tipo // tipo - O tipo do quarto (ex: solteiro, duplo).
      this.precoDiaria = precoDiaria // precoDiaria - O preço da diária.
   }
}

export class Reserva {
   constructor(quarto, dataCheckIn, dataCheckOut, cliente) {
      this.quarto = quarto
      this.dataCheckIn = dataCheckIn
      this.dataCheckOut = dataCheckOut
      this.cliente = cliente // cliente - O objeto Cliente associado à reserva.
   }
   mostrarInfo() {
     console.log(`Quarto: ${this.quarto.numero} - Tipo: ${this.quarto.tipo} - Preço da Diária: R$${this.quarto.precoDiaria.toFixed(2)}`)
     console.log(`Check-In: ${this.dataCheckIn.toLocaleDateString('pt-BR')}`)
     console.log(`Check-Out: ${this.dataCheckOut.toLocaleDateString('pt-BR')}`)
     console.log(`Cliente: ${this.cliente.nome}`)
    }
  }

export class Pousada {
    constructor(nome, quartos, reservas) {
        this.nome = nome
        this.quartos = quartos
        this.reservas = reservas
    }   
    adicionarQuarto(quarto) {
        this.quartos.push(quarto)
    }
    listarQuartos() {
        this.quartos.forEach((quarto) => {
            console.log(`Quarto ${quarto.numero} - Tipo: ${quarto.tipo} - Preço da Diária: R$${quarto.precoDiaria.toFixed(2)}`)
        })
    }
    adicionarReserva(reserva) {
        this.reservas.push(reserva)
    }
    listarReservas() {
        this.reservas.forEach((reserva) => {
            console.log(`Reserva: Quarto ${reserva.quarto.numero} - Check-In: ${reserva.dataCheckIn.toLocaleDateString('pt-BR')} - Check-Out: ${reserva.dataCheckOut.toLocaleDateString('pt-BR')} - Cliente: ${reserva.cliente.nome}`)
        })
    }
     informacoesreserva() {
        this.reservas.forEach((reserva) => {
            reserva.mostrarInfo()
            console.log('-------------------------')
        })
      }
}
  export class QuartoOcupadoError extends Error {
    constructor(quartoNumero, checkIn, checkOut) {
        // Chama o construtor da classe pai (Error) com uma mensagem padrão
        super(`O Quarto ${quartoNumero} já está reservado no período de ${checkIn.toLocaleDateString('pt-BR')} a ${checkOut.toLocaleDateString('pt-BR')}.`)
        
        // Define o nome do erro para facilitar a identificação (opcional, mas recomendado)
        this.name = 'QuartoOcupadoError'
        
        // Armazena detalhes específicos
        this.quartoNumero = quartoNumero
        this.checkIn = checkIn
        this.checkOut = checkOut
    }
}
   export class DataInvalidaError extends Error {
    constructor(message) {
        super(message)
        this.name = 'DataInvalidaError'
    } 
    reservaDataInvalida(dataCheckIn, dataCheckOut) {
        if (dataCheckIn >= dataCheckOut) {
            throw new DataInvalidaError('Data de Check-Out deve ser posterior à Data de Check-In.')
        }
    }
    reservaQuartoOcupado(quarto, dataCheckIn, dataCheckOut) {
        for (let reserva of this.reservas) {
            if (reserva.quarto.numero === quarto.numero) {
                // Verifica se as datas se sobrepõem
                if ((dataCheckIn < reserva.dataCheckOut) && (dataCheckOut > reserva.dataCheckIn)) {
                    throw new QuartoOcupadoError(quarto.numero, dataCheckIn, dataCheckOut)
                }
            }

        }
    }
    adicionarnovosquartos(quarto, dataCheckIn, dataCheckOut) {
        this.reserva.dataInvalida(dataCheckIn, dataCheckOut)
        this.reservadequartoOcupado(quarto, dataCheckIn, dataCheckOut)
    }
    cancelarReserva(reserva) {
        const index = this.reservas.indexOf(reserva)
        if (index !== -1) {
            this.reservas.splice(index, 1)
        }
    }
    listarQuartosDisponiveis() {
        const quartosOcupados = this.reservas.map(reserva => reserva.quarto.numero)
        const quartosDisponiveis = this.quartos.filter(quarto => !quartosOcupados.includes(quarto.numero))
        if (quartosDisponiveis.length > 0) {
            console.log('Quartos Disponíveis:')
            quartosDisponiveis.forEach(quarto => {
                console.log(`Quarto ${quarto.numero} - Tipo: ${quarto.tipo} - Preço da Diária: R$${quarto.precoDiaria.toFixed(2)}`)
            })
        } else {
            console.log('Não há quartos disponíveis no momento.')
        }
    }
        listartodasasreservas() {
            if (this.reservas.length > 0) {
                console.log('Reservas Atuais:')
                this.reservas.forEach(reserva => {
                    console.log(`Quarto ${reserva.quarto.numero} - Check-In: ${reserva.dataCheckIn.toLocaleDateString('pt-BR')} - Check-Out: ${reserva.dataCheckOut.toLocaleDateString('pt-BR')} - Cliente: ${reserva.cliente.nome}`)
                })
            } else {
                console.log('Não há reservas no momento.')
            } 
        }
   }

   





   