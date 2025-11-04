// ...existing code...
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');
const WebSocket = require('ws'); // Necessário para a comunicação em tempo real

// --- Variáveis Globais Mutáveis (Configuradas pelo Frontend) ---
let WHATSAPP_TOKEN = '';
let PHONE_NUMBER_ID = ''; // Ou o número de telefone de teste
let API_VERSION = 'v19.0';
let mainWindow = null;

// --- CONFIGURAÇÃO DA CONEXÃO WEBSOCKET ---
// O cliente Electron tentará se conectar a este servidor.
const WS_SERVER_URL = 'ws://localhost:8080';
let ws = null;

/**
Tenta conectar o cliente WebSocket ao servidor.
Esta função também lida com reconexões.
*/
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

            // Retransmite a nova mensagem para o processo de Renderização (frontend)
            if (mainWindow) {
                mainWindow.webContents.send('nova-mensagem-recebida', mensagem);
            }
        } catch (e) {
            console.error('[WS] Erro ao processar mensagem JSON:', e.message);
        }
    });

    ws.on('close', () => {
        console.log('[WS] Conexão WebSocket fechada. Tentando reconectar em 5s...');
        // Tenta reconectar após 5 segundos
        setTimeout(connectWebSocket, 5000);
    });

    ws.on('error', (err) => {
        console.error('[WS] Erro no WebSocket. Conexão será fechada:', err.message);
        // O evento 'close' será disparado em seguida, o que tentará a reconexão.
    });
}

// --- LÓGICA DE ENVIO PARA A API DO WHATSAPP (Backend/Seguro) ---

/**
Função principal para enviar mensagens usando a Cloud API da Meta.
*/
async function enviarMensagemWhatsApp(numeroDestino, mensagem) {
    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
        throw new Error('As credenciais da API do WhatsApp não estão configuradas. Por favor, conecte-se via Configurações.');
    }

    // A URL da API usa o PHONE_NUMBER_ID como parte do caminho
    const WHATSAPP_API_URL = `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`;

    const payload = {
        messaging_product: 'whatsapp',
        to: numeroDestino,
        type: 'text',
        text: {
            body: mensagem
        }
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

// --- CONTROLE DA JANELA E CRIAÇÃO ---

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true // ESSENCIAL para segurança
        }
    });

    mainWindow.loadFile('index.html');

    // Descomente para abrir o DevTools automaticamente para debug:
    // mainWindow.webContents.openDevTools();
}

// --- INICIALIZAÇÃO DO ELECTRON ---

app.whenReady().then(() => {
    createWindow();
    connectWebSocket(); // Tenta iniciar a conexão WebSocket

    app.on('activate', () => {
        // Recriar a janela no macOS quando o dock icon é clicado
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    // --- MANIPULADORES IPC (IPC Main, o Main escuta o Renderer) ---

    // 1. Manipulador para configurar as credenciais da API
    ipcMain.handle('config-whatsapp-credentials', (event, { token, id }) => {
        // Armazena as chaves de forma segura no Main Process
        WHATSAPP_TOKEN = token || '';
        PHONE_NUMBER_ID = id || '';

        // Verifica se o token é um valor de teste (ex: 'TOKEN_DE_TESTE_123')
        if (WHATSAPP_TOKEN.startsWith('TOKEN_DE_TESTE_')) {
            console.log('Credenciais de teste recebidas. O envio de mensagens será simulado.');
            return { sucesso: true, status: 'Conectado (Teste/Simulação)' };
        }

        // Em um ambiente de produção, aqui você faria uma chamada rápida à API
        // para validar as credenciais antes de retornar sucesso.
        console.log('Credenciais da API do WhatsApp armazenadas com sucesso.');
        return { sucesso: true, status: 'Conectado (Meta Cloud API)' };
    });

    // 2. Manipulador para enviar mensagens (acionado pelo frontend)
    ipcMain.handle('send-whatsapp-message', async (event, { numero, mensagem }) => {
        try {
            // Verifica se está em modo de simulação
            if (WHATSAPP_TOKEN && WHATSAPP_TOKEN.startsWith('TOKEN_DE_TESTE_')) {
                console.log(`[SIMULAÇÃO] Mensagem para ${numero} enviada.`);
                return { sucesso: true, dados: { status: 'simulado' } };
            }

            // Se não for simulação, chama a função real da API
            const resultado = await enviarMensagemWhatsApp(numero, mensagem);
            return { sucesso: true, dados: resultado };

        } catch (erro) {
            // Retorna o erro para o Renderer tratar
            return { sucesso: false, erro: erro.message };
        }
    });
});

// Encerra o aplicativo quando todas as janelas forem fechadas (exceto no macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
// ...existing code...