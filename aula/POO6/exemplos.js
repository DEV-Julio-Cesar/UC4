import PromptSync from "prompt-sync";
const prompt = PromptSync()

//let teste = 'teste'
//console.log(testes)

class TesteError extends Error{ // classe para tratamento de erro herdando da classe Error
    constructor(message){ 
        super(message) // herdando o construtor da classe Error
    }
}

function validarCpf(cpf){ // função para validar o cpf
    if(isNaN(Number(cpf)) ){ // verificando se o cpf é um valor diferente de número
        throw new TesteError('Error! Precisa ser números!') // lançamento de exceção, usando a classe TesteError criada
    }
    if(cpf.length !== 11){ // verificando se o cpf tem uma quantidade diferente de 11 dígitos
        throw new TesteError('Error! Quantidade de dígitos incorreta, é necessário 11 dígitos.')
    }
    return cpf // se não entrar nos testes, retorna o cpf
}

//tratamento de exceção
try{ // geração
    let cpf = validarCpf(prompt('Digite o cpf:')) // chama a função
    console.log(`${cpf} - validado!`)
}catch(error){ // captura da exceção
    console.error(error.message) // tratamento da exceção gerada
}


