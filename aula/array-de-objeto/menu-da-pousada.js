import PromptSync from "prompt-sync"
const prompt = PromptSync()


import { Cliente } from './sistema-pousada-class.js'
import { Quarto } from './sistema-pousada-class.js'
import { Reserva } from './sistema-pousada-class.js'
import { Pousada } from './sistema-pousada-class.js'



const hotel = new Pousada('Gostoso Paradise', [], [])
hotel.adicionarQuarto(new Quarto(101, 'Solteiro', 120.00))
hotel.adicionarQuarto(new Quarto(205, 'Duplo', 180.00))
hotel.adicionarQuarto(new Quarto(310, 'Luxo', 250.00))

let executando = true

// 2. Loop principal do Menu
while (executando) {
    console.log('\n=====================================')
    console.log(`   SISTEMA DE RESERVAS - ${hotel.nome}`)
    console.log('=====================================')
    console.log('Selecione seu Perfil:')
    console.log('1. Atendente do Hotel')
    console.log('2. Cliente')
    console.log('0. Sair')
    console.log('-------------------------------------')

    // CORREÇÃO B: Trocando lerEntrada por prompt
    const perfil = prompt('Digite a opção do perfil: ')

    switch (perfil) {
        case '1':
        case '2':
            let continuarMenuPerfil = true
            while (continuarMenuPerfil) {
                console.log('\n--- MENU DE OPÇÕES ---')
                if (perfil === '1') {
                    console.log('1. ADICIONAR NOVO QUARTO (1)')
                    console.log('2. FAZER RESERVA (1)(2)')
                    console.log('3. CANCELAR RESERVA (1)(2)')
                    console.log('4. LISTAR QUARTOS DISPONÍVEIS (1)(2)')
                    console.log('5. LISTAR TODAS AS RESERVAS (1)')
                    console.log('6. MOSTRAR DETALHES DE UMA RESERVA')
                    console.log('7. Voltar ao menu de Perfil')
                } else {
                    console.log('2. FAZER RESERVA (2)')
                    console.log('3. CANCELAR RESERVA (2)')
                    console.log('4. LISTAR QUARTOS DISPONÍVEIS (2)')
                    console.log('7. Voltar ao menu de Perfil')
                }

                let opcao = prompt('Digite a opção desejada: ') // CORREÇÃO B

                if (perfil === '2') {
                    if (opcao === '2') opcao = 'reserva'
                    else if (opcao === '3') opcao = 'cancelar'
                    else if (opcao === '4') opcao = 'disponivel'
                    else if (opcao === '7') opcao = 'voltar'
                    else {
                        console.log('Opção inválida para o perfil Cliente.')
                        continue
                    }
                }

                switch (opcao) {
                    case '1':
                        if (perfil === '1') {
                            const num = parseInt(prompt('Número do novo quarto: ')) // CORREÇÃO B
                            const tipo = prompt('Tipo do Quarto (Solteiro/Duplo/Luxo): ') // CORREÇÃO B
                            const preco = parseFloat(prompt('Preço da diária: ')) // CORREÇÃO B
                            hotel.adicionarQuarto(new Quarto(num, tipo, preco))
                        }
                        break

                    case '2':
                    case 'reserva':
                        console.log('\n--- DADOS DO CLIENTE ---')
                        const nome = prompt('Nome do Cliente: ') // CORREÇÃO B
                        const cpf = prompt('CPF: ') // CORREÇÃO B
                        const contato = prompt('Contato (telefone/email): ') // CORREÇÃO B
                        const novoCliente = new Cliente(nome, cpf, contato)

                        console.log('\n--- DADOS DA RESERVA ---')
                        const numQuarto = parseInt(prompt('Número do Quarto desejado: ')) // CORREÇÃO B
                        const dataInStr = prompt('Data de Check-In (AAAA/MM/DD): ') // CORREÇÃO B
                        const dataOutStr = prompt('Data de Check-Out (AAAA/MM/DD): ') // CORREÇÃO B

                        const quartoDesejado = hotel.quartos.find(q => q.numero === numQuarto)
                        
                        if (!quartoDesejado) {
                            console.log('⚠️ Erro: Quarto não encontrado na lista do hotel.')
                            break
                        }

                        try {
                            const checkIn = new Date(dataInStr)
                            const checkOut = new Date(dataOutStr)
                            hotel.reservarQuarto(quartoDesejado, checkIn, checkOut, novoCliente)
                        } catch (error) {
                            console.log(`\n❌ ERRO: ${error.message}`)
                        }
                        break

                    case '3':
                    case 'cancelar':
                        hotel.listarReservas()
                        if (hotel.reservas.length === 0) break
                        
                        const idx = parseInt(prompt('Digite o NÚMERO da reserva (da lista acima) para cancelar: ')) - 1 // CORREÇÃO B
                        const reservaParaCancelar = hotel.reservas[idx]
                        
                        if (reservaParaCancelar) {
                            hotel.cancelarReserva(reservaParaCancelar)
                        } else {
                            console.log('⚠️ Erro: Número da reserva inválido.')
                        }
                        break

                    case '4':
                    case 'disponivel':
                        hotel.listarQuartosDisponiveis()
                        break

                    case '5':
                        if (perfil === '1') {
                            hotel.listarReservas()
                        }
                        break

                    case '6':
                        if (perfil === '1') {
                            hotel.listarReservas()
                            if (hotel.reservas.length === 0) break

                            const infoIdx = parseInt(prompt('Digite o NÚMERO da reserva (da lista acima) para ver os detalhes: ')) - 1 // CORREÇÃO B
                            hotel.informacoesReserva(hotel.reservas[infoIdx])
                        }
                        break

                    case '7':
                    case 'voltar':
                        continuarMenuPerfil = false
                        break
                        
                    default:
                        console.log('Opção inválida. Tente novamente.')
                }
            }
            break

        case '0':
            executando = false
            console.log('Saindo do Sistema...')
            break

        default:
            console.log('Perfil inválido. Tente novamente.')
    }
}