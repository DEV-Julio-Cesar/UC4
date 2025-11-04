// preload.js - Script de Pré-carregamento (Ponte Segura IPC)
const { contextBridge, ipcRenderer } = require('electron');

// Expõe uma API 'whatsappAPI' no objeto window do Renderer
contextBridge.exposeInMainWorld('whatsappAPI', {
    /**
     * Envia credenciais (Token e ID/Número de Telefone) para o Processo Principal.
     * @param {string} token - Token de Acesso da Meta.
     * @param {string} id - ID do Número de Telefone ou Número de Teste (55XX...).
     * @returns {Promise<object>} - O resultado da operação de configuração.
     */
    configurarCredenciais: (token, id) => {
        return ipcRenderer.invoke('config-whatsapp-credentials', { token, id });
    },

    /**
     * Envia uma mensagem de chat para o Processo Principal, que a encaminhará para a API do WhatsApp.
     * @param {string} numero - O número de telefone do destinatário.
     * @param {string} mensagem - O texto da mensagem a ser enviada.
     * @returns {Promise<object>} - O resultado da operação de envio (sucesso/erro).
     */
    enviarMensagem: (numero, mensagem) => {
        // Usa ipcRenderer.invoke() para enviar uma mensagem assíncrona para o Main.
        return ipcRenderer.invoke('send-whatsapp-message', { numero, mensagem });
    },

    /**
     * Assina um evento para receber novas mensagens do WhatsApp, retransmitidas do Main via WebSocket/IPC.
     * @param {function} callback - Função para ser chamada quando uma nova mensagem chegar.
     */
    onNovaMensagemRecebida: (callback) => {
        // Configura um ouvinte de eventos do Main.
        ipcRenderer.on('nova-mensagem-recebida', (event, mensagem) => callback(mensagem));
    }
});
