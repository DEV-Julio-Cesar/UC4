import PromptSync from "prompt-sync"
const prompt = PromptSync()

class Memoria {
    #tipo;
    #frequencia;
    #capacidade; // Capacidade total em GB
    #usada;      // Memória usada em GB

    constructor(tipo, frequencia, capacidade) {
        this.#tipo = tipo;
        this.#frequencia = frequencia;
        this.#capacidade = capacidade;
        this.#usada = 0; // Inicialmente, 0GB usados
    }

    usarMemoria(qtd) {
        if (this.#usada + qtd <= this.#capacidade) {
            this.#usada += qtd;
            console.log(`✅ ${qtd}GB de memória usados. Total usado: ${this.#usada}GB.`);
            return true;
        } else {
            console.log(`❌ Não há memória suficiente para usar ${qtd}GB. Disponível: ${this.#capacidade - this.#usada}GB.`);
            return false;
        }
    }

    liberarMemoria(qtd) {
        if (this.#usada - qtd >= 0) {
            this.#usada -= qtd;
            console.log(`✅ ${qtd}GB de memória liberados. Total usado: ${this.#usada}GB.`);
        } else {
            this.#usada = 0;
            console.log(`✅ Toda a memória foi liberada. Total usado: 0GB.`);
        }
    }

    get ficha() {
        return `Tipo: ${this.#tipo} | Frequência: ${this.#frequencia}MHz | Capacidade: ${this.#capacidade}GB | Usada: ${this.#usada}GB`;
    }
}


class Processador {
    #marca;
    #modelo;
    #nucleo;
    #velocidade;

    constructor(marca, modelo, nucleo, velocidade) {
        this.#marca = marca;
        this.#modelo = modelo;
        this.#nucleo = nucleo;
        this.#velocidade = velocidade;
    }

    executarPrograma(nome) {
        console.log(`🚀 Processador ${this.#modelo} (Núcleos: ${this.#nucleo}) está executando o programa "${nome}".`);
    }

    get ficha() {
        return `Marca: ${this.#marca} | Modelo: ${this.#modelo} | Núcleos: ${this.#nucleo} | Velocidade: ${this.#velocidade}GHz`;
    }
}


class Armazenamento {
    #tipo;
    #capacidade; // Capacidade total em GB
    #espaco_utilizado;

    constructor(tipo, capacidade, espaco_utilizado = 0) {
        this.#tipo = tipo;
        this.#capacidade = capacidade;
        this.#espaco_utilizado = espaco_utilizado;
    }

    espacoLivre() {
        const livre = this.#capacidade - this.#espaco_utilizado;
        return livre > 0 ? livre : 0;
    }

    get ficha() {
        return `Tipo: ${this.#tipo} | Capacidade: ${this.#capacidade}GB | Livre: ${this.espacoLivre()}GB`;
    }
    
    // Método auxiliar para simular instalação de software
    instalar(tamanho) {
        if (this.espacoLivre() >= tamanho) {
            this.#espaco_utilizado += tamanho;
            return true;
        }
        return false;
    }

    // Método auxiliar para simular remoção de software
    remover(tamanho) {
        this.#espaco_utilizado -= tamanho;
        if (this.#espaco_utilizado < 0) this.#espaco_utilizado = 0;
    }
}


class Tela {
    #tamanho;
    #resolucao;
    #ligada;

    constructor(tamanho, resolucao) {
        this.#tamanho = tamanho;
        this.#resolucao = resolucao;
        this.#ligada = false;
    }

    ligar() {
        if (!this.#ligada) {
            this.#ligada = true;
            console.log(`💡 A tela foi ligada. Status: ON.`);
        } else {
             console.log(`✅ A tela já está ligada.`);
        }
    }

    desligar() {
        if (this.#ligada) {
            this.#ligada = false;
            console.log(`⚫ A tela foi desligada. Status: OFF.`);
        } else {
            console.log(`✅ A tela já está desligada.`);
        }
    }

    get ficha() {
        return `Tamanho: ${this.#tamanho} polegadas | Resolução: ${this.#resolucao} | Estado: ${this.#ligada ? 'Ligada' : 'Desligada'}`;
    }
}


class Computador {
    #marca;
    #modelo;
    // Atributos de Composição
    #memoria; // Objeto Memoria
    #processador; // Objeto Processador
    #armazenamento; // Objeto Armazenamento
    #tela; // Objeto Tela
    
    // Novo Atributo (opcional) para Softwares
    #softwaresInstalados;
    #softwaresTamanhos; // Para rastrear o espaço ocupado

    constructor(marca, modelo, memoria, processador, armazenamento, tela) {
        this.#marca = marca;
        this.#modelo = modelo;
        this.#memoria = memoria; // Composição: Computador TEM uma Memoria
        this.#processador = processador; // Composição: Computador TEM um Processador
        this.#armazenamento = armazenamento; // Composição: Computador TEM um Armazenamento
        this.#tela = tela; // Composição: Computador TEM uma Tela
        this.#softwaresInstalados = [];
        this.#softwaresTamanhos = new Map();
    }

    // Acessores (Getters) para interagir com os atributos
    get memoria() { return this.#memoria; }
    get processador() { return this.#processador; }
    get armazenamento() { return this.#armazenamento; }
    get tela() { return this.#tela; }

    imprimirFichaTecnica() {
        console.log(`\n============================================`);
        console.log(`FICHA TÉCNICA - ${this.#marca} ${this.#modelo}`);
        console.log(`============================================`);
        console.log(`\n[ Memória ]: ${this.#memoria.ficha}`);
        console.log(`[ Processador ]: ${this.#processador.ficha}`);
        console.log(`[ Armazenamento ]: ${this.#armazenamento.ficha}`);
        console.log(`[ Tela ]: ${this.#tela.ficha}`);
        console.log(`--------------------------------------------`);
        this.listarSoftware();
        console.log(`============================================\n`);
    }

    instalarSoftware(nome, tamanho) {
        if (this.#softwaresInstalados.includes(nome)) {
            console.log(`❌ O software "${nome}" já está instalado.`);
            return;
        }

        if (this.#armazenamento.instalar(tamanho)) {
            this.#softwaresInstalados.push(nome);
            this.#softwaresTamanhos.set(nome, tamanho); 
            console.log(`✅ Software "${nome}" (${tamanho}GB) instalado com sucesso!`);
        } else {
            console.log(`❌ Não foi possível instalar "${nome}". Espaço insuficiente.`);
        }
    }

    listarSoftware() {
        if (this.#softwaresInstalados.length === 0) {
            console.log('📦 Nenhum software instalado.');
            return;
        }
        console.log(`📦 Softwares Instalados (${this.#softwaresInstalados.length}):`);
        this.#softwaresInstalados.forEach(nome => {
            console.log(`   - ${nome} (${this.#softwaresTamanhos.get(nome)}GB)`);
        });
    }

    removerSoftware(nome) {
        const index = this.#softwaresInstalados.indexOf(nome);
        if (index > -1) {
            this.#softwaresInstalados.splice(index, 1);
            const tamanho = this.#softwaresTamanhos.get(nome);
            this.#armazenamento.remover(tamanho);
            this.#softwaresTamanhos.delete(nome);
            console.log(`✅ Software "${nome}" removido com sucesso! ${tamanho}GB liberados.`);
        } else {
            console.log(`❌ O software "${nome}" não está instalado.`);
        }
    }
}
// ----------------------------------------------------------------------------------
// CRIAÇÃO E INTERAÇÃO COM OS OBJETOS (EXECUÇÃO)
// ----------------------------------------------------------------------------------

// Componentes para o Computador 1 (Estação de Trabalho)
const mem1 = new Memoria("DDR5", 6000, 32);
const cpu1 = new Processador("Intel", "Core i9-13900K", 24, 5.8);
const ssd1 = new Armazenamento("SSD NVMe", 2000);
const tela1 = new Tela(27, "4K (3840x2160)");

// Componentes para o Computador 2 (Notebook Básico)
const mem2 = new Memoria("DDR4", 3200, 8);
const cpu2 = new Processador("AMD", "Ryzen 5 5500U", 6, 4.0);
const hdd2 = new Armazenamento("HDD", 1000);
const tela2 = new Tela(15.6, "Full HD (1920x1080)");

// Criação dos objetos Computador usando Composição
const comp1 = new Computador("Dell", "Alienware", mem1, cpu1, ssd1, tela1);
const comp2 = new Computador("Lenovo", "IdeaPad", mem2, cpu2, hdd2, tela2);

console.log('============================================');
console.log('✅ Dois computadores criados com sucesso! ');
console.log('============================================');

// 1. Mostrando as configurações
comp1.imprimirFichaTecnica();
comp2.imprimirFichaTecnica();

console.log('>>> INTERAÇÃO COM O COMPUTADOR 1 (Estação de Trabalho) <<<');

// 2. Interação com métodos do Computador (Software)
comp1.instalarSoftware("Photoshop", 5);
comp1.instalarSoftware("Visual Studio Code", 0.5);
comp1.instalarSoftware("Jogo AAA", 90);

comp1.removerSoftware("Jogo AAA");

// 3. Interação com métodos dos Atributos internos (Encadeamento de Acessos)
console.log('\n--- Interação com Atributos Internos (Encadeamento) ---');

comp1.tela.ligar(); // Interage com a Tela
comp1.memoria.usarMemoria(10); // Interage com a Memória

// O Processador executa um programa
comp1.processador.executarPrograma("Visual Studio Code");

// Verificação final
comp1.imprimirFichaTecnica();