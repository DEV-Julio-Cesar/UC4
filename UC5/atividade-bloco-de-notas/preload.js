const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    // Salvar arquivo
    salvar: (texto) => ipcRenderer.invoke('salvar-arq', texto),

    // Abrir arquivo
    abrir: () => ipcRenderer.invoke('abrir-arq'),

    // Salvar como
    salvarComo: (texto) => ipcRenderer.invoke('salvarComo-arq', texto),
    
    // Listener para menu abrir (corrigido)
    onMenuAbrir: (callback) => {
        ipcRenderer.on('menu-abrir', () => callback());
    },
    
    // Remover listener
    removeAllListeners: (channel) => {
        ipcRenderer.removeAllListeners(channel);
    }
});