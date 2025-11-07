// =========================================================================
// 1. IMPORTAÇÕES (Todas no topo)
// =========================================================================
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');
const WebSocket = require('ws');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs-extra');
const { validateCredentials } = require('./auth'); // Importa a função de login

// =========================================================================
// 2. VARIÁVEIS GLOBAIS
// =========================================================================
let WHATSAPP_TOKEN = '';
let PHONE_NUMBER_ID = '';
let API_VERSION = 'v19.0';
let mainWindow = null;
let loginWindow = null; // Variável para a janela de login
let whatsappClient = null;
const WS_SERVER_URL = 'ws://localhost:8080';
let ws = null;

// =========================================================================
// 3. DEFINIÇÕES DE FUNÇÕES (Todas antes de 'app.whenReady')
// =========================================================================

// --- FUNÇÃO WEBSOCKET (Sua lógica original) ---
function connectWebSocket() {
    console.log(`[WS] Tentando conectar ao servidor em ${WS_SERVER_URL}...`);
    ws = new WebSocket(WS_SERVER_URL);

    ws.on('open', () => {
        console.log('[WS] Conexão WebSocket estabelecida com sucesso!');
    });
    ws.on('message', (data) => {
        try {
            const mensagem = JSON.parse(data.toString());
            console.log('[WS] Nova mensagem recebida, retransmitindo para o Renderer.');
            if (mainWindow) {
                mainWindow.webContents.send('nova-mensagem-recebida', mensagem);
            }
        } catch (e) {
            console.error('[WS] Erro ao processar mensagem JSON:', e.message);
        }
    });
    ws.on('close', () => {
        console.log('[WS] Conexão WebSocket fechada. Tentando reconectar em 5s...');
        setTimeout(connectWebSocket, 5000);
    });
    ws.on('error', (err) => {
        console.error('[WS] Erro no WebSocket. Conexão será fechada:', err.message);
    });
}

// --- FUNÇÃO CLOUD API (Sua lógica original) ---
async function enviarMensagemWhatsApp(numeroDestino, mensagem) {
    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
        throw new Error('As credenciais da API do WhatsApp não estão configuradas.');
    }
    const WHATSAPP_API_URL = `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`;
    const payload = {
        messaging_product: 'whatsapp',
        to: numeroDestino,
        type: 'text',
        text: { body: mensagem }
    };
    try {
        const response = await axios.post(WHATSAPP_API_URL, payload, {
            headers: {
                'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Mensagem enviada com sucesso pela API:', response.data);
        return response.data;
    } catch (error) {
        console.error('ERRO ao enviar mensagem via API do WhatsApp:', error.response ? error.response.data : error.message);
        throw new Error(`Falha na API do WhatsApp: ${error.response ? (error.response.data?.error?.message || 'Erro desconhecido') : error.message}`);
    }
}

// --- FUNÇÕES DE JANELA (Reintroduzidas e Corrigidas) ---

/**
 * 🚨 RE-ADICIONADA: Cria a Janela de Login
 */
function createLoginWindow() {
    loginWindow = new BrowserWindow({
        width: 450,
        height: 550,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload-login.js'), // Preload do Login
            nodeIntegration: false,
            contextIsolation: true
        }
    });
    loginWindow.loadFile('login.html');
}
