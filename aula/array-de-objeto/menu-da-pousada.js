import PromptSync from "prompt-sync"
const prompt = PromptSync()

import { Cliente } from './sistema-pousada-class.js'
import { Quarto } from './sistema-pousada-class.js'
import { Pousada } from './sistema-pousada-class.js'
import { DataInvalidaError } from './sistema-pousada-class.js'

const hotel = new Pousada('Gostoso Paradise', [], [])
hotel.adicionarQuarto(new Quarto(101, 'Solteiro', 120.00))
hotel.adicionarQuarto(new Quarto(205, 'Duplo', 180.00))
hotel.adicionarQuarto(new Quarto(310, 'Luxo', 250.00))

let executando = true

function getNumeroValido(mensagem) {
    let entrada = prompt(mensagem)
    // Verifica se a string está vazia antes de tentar converter
    if (entrada.trim() === '') return null
    
    let num = parseFloat(entrada)
    if (isNaN(num) || num <= 0) {
        console.log('⚠️ Erro: Entrada inválida. Digite um número maior que zero.')
        return null
    }
    return num
}

function listarReservasECancelar() {
    // Retorna o número de reservas para evitar chamar o método listando duas vezes
    if (hotel.listarReservas() === 0) return

    const entradaIdx = getNumeroValido('Digite o NÚMERO (da lista acima) para cancelar: ') 
    if (entradaIdx === null) return

    const idx = entradaIdx - 1
    const reservaParaCancelar = hotel.reservas[idx]
    
    // Otimização: chama o método na Pousada e usa o retorno booleano
    if (reservaParaCancelar) {
        hotel.cancelarReserva(reservaParaCancelar)
    } else {
        console.log('⚠️ Erro: Número da reserva inválido.')
    }
}

while (executando) {
    console.log('\n=====================================')
    console.log(`   SISTEMA DE RESERVAS - ${hotel.nome}`)
    console.log('=====================================')
    console.log('Selecione seu Perfil:')
    console.log('1. Atendente do Hotel')
    console.log('2. Cliente')
    console.log('0. Sair')
    console.log('-------------------------------------')

    const perfil = prompt('Digite a opção do perfil: ')

    if (perfil === '0') {
        executando = false
        console.log('Saindo do Sistema...')
        break
    }

    if (perfil !== '1' && perfil !== '2') {
        console.log('Perfil inválido. Tente novamente.')
        continue
    }

    let continuarMenuPerfil = true
    while (continuarMenuPerfil) {
        console.log('\n--- MENU DE OPÇÕES ---')
        if (perfil === '1') {
            console.log('1. ADICIONAR NOVO QUARTO')
            console.log('2. FAZER RESERVA')
            console.log('3. CANCELAR RESERVA')
            console.log('4. LISTAR QUARTOS DISPONÍVEIS')
            console.log('5. LISTAR TODAS AS RESERVAS')
            console.log('6. MOSTRAR DETALHES DE UMA RESERVA')
            console.log('7. Voltar ao menu de Perfil')
        } else {
            console.log('2. FAZER RESERVA')
            console.log('3. CANCELAR MINHA RESERVA')
            console.log('4. LISTAR QUARTOS DISPONÍVEIS')
            console.log('7. Voltar ao menu de Perfil')
        }
        console.log('-------------------------------------')

        const opcao = prompt('Digite a opção desejada: ')

        switch (opcao) {
            case '1':
                if (perfil === '1') {
                    const num = getNumeroValido('Número do novo quarto: ')
                    if (num === null) break

                    const tipo = prompt('Tipo do Quarto (Solteiro/Duplo/Luxo): ')
                    const preco = getNumeroValido('Preço da diária: ')
                    if (preco === null) break
                    
                    hotel.adicionarQuarto(new Quarto(num, tipo, preco))
                } else {
                    console.log('Opção inválida para o perfil Cliente.')
                }
                break

            case '2':
                console.log('\n--- DADOS DO CLIENTE ---')
                const nome = prompt('Nome do Cliente: ')
                const cpf = prompt('CPF: ')
                const contato = prompt('Contato (telefone/email): ')
                const novoCliente = new Cliente(nome, cpf, contato)

                console.log('\n--- DADOS DA RESERVA ---')
                hotel.listarQuartos()
                const numQuarto = getNumeroValido('Número do Quarto desejado: ')
                if (numQuarto === null) break
                
                const quartoDesejado = hotel.quartos.find(q => q.numero === numQuarto)
                
                if (!quartoDesejado) {
                    console.log('⚠️ Erro: Quarto não encontrado na lista do hotel.')
                    break
                }
                
                const dataInStr = prompt('Data de Check-In (AAAA/MM/DD): ')
                const dataOutStr = prompt('Data de Check-Out (AAAA/MM/DD): ')

                try {
                    const checkIn = new Date(dataInStr)
                    const checkOut = new Date(dataOutStr)

                    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
                         throw new DataInvalidaError('Formato de data inválido. Use AAAA/MM/DD.')
                    }

                    hotel.adicionarReserva(quartoDesejado, checkIn, checkOut, novoCliente)

                } catch (error) {
                    console.log(`\n❌ ERRO DE RESERVA: ${error.message}`)
                }
                break

            case '3':
                listarReservasECancelar()
                break

            case '4':
                hotel.listarQuartosDisponiveis()
                break

            case '5':
                if (perfil === '1') {
                    hotel.listarReservas()
                } else {
                    console.log('Opção inválida para o perfil Cliente.')
                }
                break

            case '6':
                if (perfil === '1') {
                    if (hotel.listarReservas() === 0) break

                    const infoEntrada = getNumeroValido('Digite o NÚMERO (da lista acima) para ver os detalhes: ') 
                    if (infoEntrada === null) break
                    
                    const infoIdx = infoEntrada - 1
                    const reservaParaDetalhe = hotel.reservas[infoIdx]
                    
                    if (reservaParaDetalhe) {
                        reservaParaDetalhe.mostrarInfo()
                    } else {
                        console.log('Número de reserva inválido.')
                    }
                } else {
                    console.log('Opção inválida para o perfil Cliente.')
                }
                break

            case '7':
                continuarMenuPerfil = false
                break
                
            default:
                console.log('Opção inválida. Tente novamente.')
        }
    }
}