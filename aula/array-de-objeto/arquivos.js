import fs from 'fs'
import PromptSync from 'prompt-sync'

const prompt = PromptSync()

function criarDiretorio(nome) {
    try {
    fs.mkdirSync(nome)
    }catch (error) {
        console.error('Erro ao criar o diretório: ', error.message) 
    }

}

function escreverArquivo() {
    try {
        let relatorio = descricao()
        fs.writeFileSync('./Teste/exemplo.js',
            'let linguagem = "javascript"\nconsole.log(`Manipulação de Arquivo em ${linguaguem}`)', 'utf-8' )
    } catch (error) {
        console.error('Erro ao escrever o arquivo: ', error.message)
    }
}  

function descricao(nome) {
    return `\n//Reservas da Pousada ${nome}`
}


function escreverArquivo2() {
    try {
        let relatorio = descricao(prompt('Nome do Hotel:  '))
        fs.appendFileSync('./Teste/exemplo.js', relatorio, 'utf-8')
    } catch (error) {
        console.error('Erro ao escrever o arquivo: ', error.message)
    }
}

// criarDiretorio(prompt('Digite o nome do diretório: ')) // chamando a função
escreverArquivo()
escreverArquivo2()