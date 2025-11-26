import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld('api', {
    salvar: (texto) => ipcRenderer.invoke('salvar-arq', texto),

    abrir: () => ipcRenderer.invoke('abrir-arq'),

    salvarComo: (texto) => ipcRenderer.invoke('salvarComo-arq', texto)
})