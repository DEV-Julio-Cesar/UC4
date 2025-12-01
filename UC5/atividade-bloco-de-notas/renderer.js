    // Elementos DOM
let texto = document.getElementById("texto")
let caminhoElement = document.getElementById("caminho")

// Variáveis de controle
let documentoModificado = false
let caminhoAtual = null

// Funções principais do arquivo
async function salvarArq() {
    try {
        console.log('Tentando salvar arquivo...')
        const caminho = await window.api.salvar(texto.value)
        console.log('Resposta do salvar:', caminho)
        
        if (caminho) {
            caminhoAtual = caminho
            documentoModificado = false
            updateStatusBar(`<i class="fas fa-check-circle" style="color: #4CAF50;"></i> Salvo em: ${caminho}`)
            console.log('Arquivo salvo com sucesso')
        } else {
            updateStatusBar(`<i class="fas fa-exclamation-triangle" style="color: #ff9800;"></i> Salvamento cancelado`)
            console.log('Salvamento cancelado pelo usuário')
        }
    } catch (error) {
        console.error('Erro ao salvar:', error)
        updateStatusBar(`<i class="fas fa-exclamation-triangle" style="color: #f44336;"></i> Erro ao salvar arquivo`)
    }
}

async function abrirArq() {
    try {
        const conteudo = await window.api.abrir()
        if (conteudo !== undefined) {
            texto.value = conteudo
            documentoModificado = false
            updateStatusBar(`<i class="fas fa-folder-open" style="color: #2196F3;"></i> Arquivo carregado com sucesso`)
        }
    } catch (error) {
        console.error('Erro ao abrir:', error)
        updateStatusBar(`<i class="fas fa-exclamation-triangle" style="color: #f44336;"></i> Erro ao abrir arquivo`)
    }
}

async function salvarComoArq() {
    try {
        console.log('Tentando salvar como...')
        const caminho = await window.api.salvarComo(texto.value)
        console.log('Resposta do salvar como:', caminho)
        
        if (caminho) {
            caminhoAtual = caminho
            documentoModificado = false
            updateStatusBar(`<i class="fas fa-save" style="color: #FF9800;"></i> Salvo como: ${caminho}`)
            console.log('Arquivo salvo como com sucesso')
        } else {
            updateStatusBar(`<i class="fas fa-exclamation-triangle" style="color: #ff9800;"></i> Salvamento cancelado`)
            console.log('Salvamento cancelado pelo usuário')
        }
    } catch (error) {
        console.error('Erro ao salvar como:', error)
        updateStatusBar(`<i class="fas fa-exclamation-triangle" style="color: #f44336;"></i> Erro ao salvar como`)
    }
}

// Função para atualizar a barra de status
function updateStatusBar(message) {
    if (caminhoElement) {
        caminhoElement.innerHTML = message
    }
}

// Configuração dos listeners do menu
function setupMenuListeners() {
    // Listener para menu Abrir
    const removeAbrirListener = window.api.onMenuAbrir(() => {
        console.log('Menu Abrir acionado')
        abrirArq()
    })

    // Listener para menu Salvar
    const removeSalvarListener = window.api.onMenuSalvar(() => {
        console.log('Menu Salvar acionado')
        salvarArq()
    })

    // Listener para menu Salvar Como
    const removeSalvarComoListener = window.api.onMenuSalvarComo(() => {
        console.log('Menu Salvar Como acionado')
        salvarComoArq()
    })

    // Retorna função para limpar todos os listeners
    return () => {
        removeAbrirListener()
        removeSalvarListener()
        removeSalvarComoListener()
    }
}

// Função para detectar mudanças no texto
function setupTextChangeDetection() {
    texto.addEventListener('input', () => {
        if (!documentoModificado) {
            documentoModificado = true
            updateStatusBar(`<i class="fas fa-edit" style="color: #FF9800;"></i> Documento modificado - Não salvo`)
        }
    })
}

// Função para atalhos de teclado
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
        // Ctrl + S para salvar
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault()
            salvarArq()
        }
        
        // Ctrl + O para abrir
        if (event.ctrlKey && event.key === 'o') {
            event.preventDefault()
            abrirArq()
        }
        
        // Ctrl + Shift + S para salvar como
        if (event.ctrlKey && event.shiftKey && event.key === 'S') {
            event.preventDefault()
            salvarComoArq()
        }
    })
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Configurar listeners do menu
    const cleanupMenuListeners = setupMenuListeners()
    
    // Configurar detecção de mudanças no texto
    setupTextChangeDetection()
    
    // Configurar atalhos de teclado
    setupKeyboardShortcuts()
    
    // Configurar status inicial
    updateStatusBar(`<i class="fas fa-info-circle"></i> Novo documento - Pronto para edição`)
    
    // Cleanup quando a janela for fechada
    window.addEventListener('beforeunload', () => {
        cleanupMenuListeners()
        window.api.removeAllListeners()
    })
    
    console.log('Editor de texto inicializado com sucesso!')
})

// Fazer funções globais para os botões HTML
window.salvarArq = salvarArq
window.abrirArq = abrirArq  
window.salvarComoArq = salvarComoArq