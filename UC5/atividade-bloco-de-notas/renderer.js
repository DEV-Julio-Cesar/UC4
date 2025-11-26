    let texto = document.getElementById("texto")    

function salvarArq(){
    window.api.salvar(texto.value).then((caminho) =>{
        document.getElementById("caminho").innerHTML = `Caminho: ${caminho}`
    })    
}

function abrirArq(){
    window.api.abrir().then((conteudo) => {
        texto.value = conteudo
    })
}

function salvarComoArq(){
    window.api.salvarComo(texto.value).then((caminho) =>{
        document.getElementById("caminho").innerHTML = `Caminho: ${caminho}`
    })
}