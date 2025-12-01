// Array para armazenar as tarefas
let tarefas = [];

// Elementos do DOM
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const tasksList = document.getElementById('tasksList');
const tasksCount = document.getElementById('tasksCount');
const statusMessage = document.getElementById('statusMessage');

// Carregar tarefas quando a página inicializar
document.addEventListener('DOMContentLoaded', async () => {
    await carregarTarefas();
    renderizarTarefas();
    
    // Adicionar listener para Enter no campo de título
    taskTitle.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            adicionarTarefa();
        }
    });
});

// Função para carregar tarefas do arquivo
async function carregarTarefas() {
    try {
        tarefas = await window.tarefasAPI.carregarTarefas();
        console.log('Tarefas carregadas:', tarefas);
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        mostrarMensagem('Erro ao carregar tarefas salvas', 'error');
    }
}

// Função para salvar tarefas no arquivo
async function salvarTarefas() {
    try {
        const resultado = await window.tarefasAPI.salvarTarefas(tarefas);
        if (resultado.sucesso) {
            console.log('Tarefas salvas com sucesso');
            return true;
        } else {
            mostrarMensagem(resultado.mensagem, 'error');
            return false;
        }
    } catch (error) {
        console.error('Erro ao salvar tarefas:', error);
        mostrarMensagem('Erro ao salvar tarefas', 'error');
        return false;
    }
}

// Função para adicionar nova tarefa
async function adicionarTarefa() {
    const titulo = taskTitle.value.trim();
    
    if (!titulo) {
        mostrarMensagem('Por favor, digite um título para a tarefa', 'error');
        taskTitle.focus();
        return;
    }

    // Criar nova tarefa
    const novaTarefa = {
        id: Date.now(), // ID único baseado no timestamp
        titulo: titulo,
        descricao: taskDescription.value.trim(),
        dataCriacao: new Date().toLocaleString('pt-BR'),
        dataModificacao: new Date().toLocaleString('pt-BR')
    };

    // Adicionar à lista
    tarefas.unshift(novaTarefa); // Adiciona no início para mostrar as mais recentes primeiro

    // Salvar no arquivo
    const salvou = await salvarTarefas();
    
    if (salvou) {
        // Limpar formulário
        taskTitle.value = '';
        taskDescription.value = '';
        
        // Renderizar lista atualizada
        renderizarTarefas();
        
        // Mostrar mensagem de sucesso
        mostrarMensagem(`Tarefa "${titulo}" adicionada com sucesso!`, 'success');
        
        // Focar no campo de título para próxima tarefa
        taskTitle.focus();
    }
}

// Função para renderizar lista de tarefas
function renderizarTarefas() {
    if (tarefas.length === 0) {
        tasksList.innerHTML = `
            <div class="no-tasks">
                <div><i class="fas fa-clipboard-list"></i></div>
                <p>Nenhuma tarefa adicionada ainda.</p>
                <p>Comece criando sua primeira tarefa!</p>
            </div>
        `;
        tasksCount.textContent = '0';
        return;
    }

    // Gerar HTML das tarefas
    const tarefasHTML = tarefas.map(tarefa => `
        <div class="task-item" data-id="${tarefa.id}">
            <div class="task-header">
                <h3 class="task-title">${escapeHtml(tarefa.titulo)}</h3>
                <div class="task-date">
                    <i class="fas fa-calendar-alt"></i>
                    ${tarefa.dataCriacao}
                </div>
            </div>
            ${tarefa.descricao ? `
                <div class="task-description">
                    ${escapeHtml(tarefa.descricao).replace(/\n/g, '<br>')}
                </div>
            ` : ''}
        </div>
    `).join('');

    tasksList.innerHTML = tarefasHTML;
    tasksCount.textContent = tarefas.length;
}

// Função para exportar tarefas
async function exportarTarefas() {
    if (tarefas.length === 0) {
        mostrarMensagem('Não há tarefas para exportar', 'error');
        return;
    }

    try {
        const resultado = await window.tarefasAPI.exportarTarefas(tarefas);
        if (resultado.sucesso) {
            mostrarMensagem(resultado.mensagem, 'success');
        } else {
            mostrarMensagem(resultado.mensagem, 'error');
        }
    } catch (error) {
        console.error('Erro ao exportar tarefas:', error);
        mostrarMensagem('Erro ao exportar tarefas', 'error');
    }
}

// Função para mostrar mensagens de status
function mostrarMensagem(texto, tipo = 'success') {
    statusMessage.textContent = texto;
    statusMessage.className = `status-message ${tipo}`;
    statusMessage.classList.add('show');

    // Remover mensagem após 3 segundos
    setTimeout(() => {
        statusMessage.classList.remove('show');
    }, 3000);
}

// Função para escapar HTML (segurança)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Salvar automaticamente quando a janela for fechada
window.addEventListener('beforeunload', async (e) => {
    await salvarTarefas();
});

// Atalhos de teclado
document.addEventListener('keydown', (e) => {
    // Ctrl + N: Nova tarefa
    if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        taskTitle.focus();
    }
    
    // Ctrl + E: Exportar tarefas
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        exportarTarefas();
    }
});