const { contextBridge, ipcRenderer } = require('electron');

// Exposição segura das APIs para o renderer
contextBridge.exposeInMainWorld('tarefasAPI', {
    // Carregar tarefas do arquivo
    carregarTarefas: () => ipcRenderer.invoke('carregar-tarefas'),
    
    // Salvar tarefas no arquivo
    salvarTarefas: (tarefas) => ipcRenderer.invoke('salvar-tarefas', tarefas),
    
    // Exportar tarefas para arquivo externo
    exportarTarefas: (tarefas) => ipcRenderer.invoke('exportar-tarefas', tarefas)
});