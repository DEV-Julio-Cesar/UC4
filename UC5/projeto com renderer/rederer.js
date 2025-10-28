
console.log(`SO ${process.platform}`)

console.log(`ELECTRON - ${window.api.versaoElectron()}`)

console.log(`NODE - ${process.versions.node}`)

document.getElementById('texto').innerHTML = `so: ${process.platform} \n Electron: ${process.versions.electron} \n Node: ${process.versions.node}`

console.log(`Aplicação: ${window.api.versaoNode()}`)
console.log(`Aplicação: ${window.api.versaoElectron()}`)
console.log(`Aplicação: ${window.api.nome}`)

function soma(){
    let a = 5
    let b = 13
    document.getElementById('texto').innerHTML = `${window.api.som(a,b)}`
}