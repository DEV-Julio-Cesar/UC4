import promptSync from "prompt-sync";
const prompt = promptSync();
const numero = Number(prompt("Insira valor para converção: "))
const Dolar = 5.424
const Euro = 6.353
const Peso = 0.0042
const Franco = 6.753

// converção de moedas

// Menu principal
    console.log("\n=== Qual tipo de converção quer fazer ===");
    console.log("1) Dolar");
    console.log("2) Euro");
    console.log("2) Peso");
    console.log("2) Libra");
    console.log("0) Franco\n");

// criação de variavel
let op = Number(prompt("escolha.. "))
let resultado

switch(op){
    

    case 1:
       resultado =  numero/Dolar
       console.log(`Converção de R$${numero} para Dolar : = `,resultado.toFixed(2));
       break

       case 2:
       resultado =  numero/Euro
       console.log(`Converção de R$${numero} para Euro : = `,resultado.toFixed(2));
       break

       case 3:
       resultado =  numero/Peso
       console.log(`Converção de R$${numero} para Peso : = `,resultado.toFixed(2));
       break

       case 4:
       resultado =  numero/Libra
       console.log(`Converção de R$${numero}para Libra : = `,resultado.toFixed(2));
       break

       case 5:
       resultado =  numero/Franco
       console.log(`Converção de R$${numero} para Franco : = `,resultado.toFixed(2));
       break


}

