const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');
const WebSocket = require('ws');
const qrcode = require('qrcode');
const fs = require('fs-extra');
const { Client, LocalAuth } = require('whatsapp-web.js');

// --- Variáveis Globais ---
let WHATSAPP_TOKEN = '';
let PHONE_NUMBER_ID = '';
let API_VERSION = 'v19.0';
let mainWindow = null;
let loginWindow = null;
let whatsappClient = null;
const WS_SERVER_URL = 'ws://localhost:8080';
let ws = null;
let historyWindow = null; // 🚨 NOVO

// =========================================================================
// FUNÇÕES (definidas antes de app.whenReady)
// =========================================================================

function connectWebSocket() {
    console.log(`[WS] Tentando conectar ao servidor em ${WS_SERVER_URL}...`);
    try {
        ws = new WebSocket(WS_SERVER_URL);

        ws.on('open', () => console.log('[WS] Conexão WebSocket estabelecida com sucesso!'));

        ws.on('message', (data) => {
            try {
                const mensagem = JSON.parse(data.toString());
                console.log('[WS] Nova mensagem recebida, retransmitindo para o Renderer.');
                if (mainWindow) mainWindow.webContents.send('nova-mensagem-recebida', mensagem);
            } catch (e) {
                console.error('[WS] Erro ao processar mensagem JSON:', e.message);
            }
        });

        ws.on('close', () => {
            console.log('[WS] Conexão WebSocket fechada. Tentando reconectar em 5s...');
            setTimeout(connectWebSocket, 5000);
        });

        ws.on('error', (err) => console.error('[WS] Erro no WebSocket:', err.message));
    } catch (err) {
        console.error('[WS] Falha ao instanciar WebSocket:', err);
        setTimeout(connectWebSocket, 5000);
    }
}

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
                Authorization: `Bearer ${WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('ERRO API WhatsApp:', error.response ? error.response.data : error.message);
        throw new Error(error.response ? (error.response.data?.error?.message || 'Erro desconhecido') : error.message);
    }
}

function createLoginWindow() {
    loginWindow = new BrowserWindow({
        width: 450,
        height: 550,
        frame: false,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload-login.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });
    loginWindow.loadFile('login.html');
}

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });
    mainWindow.loadFile('index.html');

    if (loginWindow) {
        loginWindow.close();
        loginWindow = null;
    }
}

// =========================================================================
// INICIALIZAÇÃO E HANDLERS IPC (TODOS DENTRO DO app.whenReady)
// =========================================================================

app.whenReady().then(() => {
    // Iniciar fluxo de login
    createLoginWindow();
    connectWebSocket();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            if (mainWindow) createMainWindow();
            else createLoginWindow();
        }
    });

    ipcMain.on('open-history-search-window', () => {
    createHistoryWindow();
});
// 8) NOVO: Manipulador IPC para Pesquisa de Histórico por Data (Simulação)
ipcMain.handle('search-chat-history', async (event, filters) => {
    // 🚨 AQUI IRIA A LÓGICA DE CONEXÃO E CONSULTA AO BANCO DE DADOS LOCAL (DB)
    console.log('[History Search] Recebido filtro:', filters);

    // --- SIMULAÇÃO DE BANCO DE DADOS ---
    if (filters.number.startsWith('55')) { 
        // Se for um número brasileiro, simula resultados.
        const mockHistory = [
            { texto: 'Olá, qual o status do pedido?', sender: 'Cliente', timestamp: new Date('2025-11-01T10:00:00').getTime() },
            { texto: 'Pedido em processamento. Entrega amanhã.', sender: 'Eu', timestamp: new Date('2025-11-01T10:05:00').getTime() },
            { texto: 'Obrigado!', sender: 'Cliente', timestamp: new Date('2025-11-02T14:30:00').getTime() },
            { texto: 'Boa tarde. Qual o novo prazo?', sender: 'Cliente', timestamp: new Date('2025-11-05T08:00:00').getTime() },
        ];
        
        // Filtra os mockups pela data
        const startTime = new Date(filters.dateStart).getTime();
        const endTime = new Date(filters.dateEnd).getTime();
        
        const filtered = mockHistory.filter(msg => {
            return msg.timestamp >= startTime && msg.timestamp <= endTime;
        });

        return { sucesso: true, history: filtered };
    }
    
    return { sucesso: false, erro: 'A consulta de histórico completo requer um banco de dados local que ainda não foi implementado.' };
});

    // -----------------------
    // AUTENTICAÇÃO (LOGIN)
    // -----------------------
    ipcMain.handle('login-attempt', async (event, { username, password }) => {
        try {
            let ok = false;
            try {
                const auth = require('./auth');
                if (typeof auth.validateCredentials === 'function') {
                    ok = await auth.validateCredentials(username, password);
                }
            } catch (e) {
                // fallback ajustado conforme solicitado
                ok = username === 'admin' && password === '123456';
            }

            if (ok) {
                createMainWindow();
                return { sucesso: true };
            }
            return { sucesso: false, erro: 'Credenciais inválidas' };
        } catch (e) {
            return { sucesso: false, erro: e.message || String(e) };
        }
    });

    // -----------------------
    // INICIAR QR CODE FLOW
    // -----------------------
    ipcMain.handle('iniciar-qr-code-flow', async () => {
        // destrói cliente antigo
        if (whatsappClient) {
            try { await whatsappClient.destroy(); } catch (e) { console.warn('Erro destroy client:', e.message); }
            whatsappClient = null;
        }

        // limpeza de sessão (se necessário)
        try {
            const baseSessionPath = path.join(app.getPath('userData'), 'Local Storage');
            if (await fs.pathExists(baseSessionPath)) {
                // LocalAuth gerencia sessão; mantemos este bloco caso queira limpar manualmente
            }
        } catch (e) {
            console.warn('Erro ao verificar/remover session path:', e.message);
        }

        whatsappClient = new Client({
            authStrategy: new LocalAuth({ clientId: 'electron-app-session' }),
            puppeteer: {
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        });

        whatsappClient.on('qr', async (qr) => {
            try {
                const qrDataURL = await qrcode.toDataURL(qr);
                if (mainWindow) mainWindow.webContents.send('qr-code-data', qrDataURL);
            } catch (e) {
                console.error('Erro gerar QR DataURL:', e.message);
            }
        });

        whatsappClient.on('ready', () => {
            console.log('WhatsApp client ready');
            if (mainWindow) mainWindow.webContents.send('whatsapp-ready');
        });

        whatsappClient.on('message', async (msg) => {
            try {
                const contact = await msg.getContact();
                const number = msg.from ? msg.from.split('@')[0] : 'unknown';
                const novaMensagem = {
                    texto: msg.body,
                    name: contact ? (contact.name || contact.pushname) : number,
                    number
                };
                if (mainWindow) mainWindow.webContents.send('nova-mensagem-recebida', novaMensagem);
            } catch (e) {
                console.error('Erro ao tratar mensagem recebida:', e.message);
            }
        });

        whatsappClient.initialize().catch(e => console.error('Erro init whatsappClient:', e));
        return { sucesso: true, status: 'Fluxo de QR Code iniciado' };
    });

    // -----------------------
    // ENVIAR MENSAGEM
    // -----------------------
    ipcMain.handle('send-whatsapp-message', async (event, { numero, mensagem }) => {
        try {
            if (WHATSAPP_TOKEN && WHATSAPP_TOKEN.startsWith('TOKEN_DE_TESTE_')) {
                console.log(`[SIMULAÇÃO] Mensagem para ${numero} enviada.`);
                return { sucesso: true, dados: { status: 'simulado' } };
            }

            if (whatsappClient && whatsappClient.info) {
                await whatsappClient.sendMessage(`${numero}@c.us`, mensagem);
                return { sucesso: true, dados: { status: 'enviado-qr' } };
            }

            const resultado = await enviarMensagemWhatsApp(numero, mensagem);
            return { sucesso: true, dados: resultado };
        } catch (erro) {
            return { sucesso: false, erro: erro.message || String(erro) };
        }
    });

    // -----------------------
    // BUSCAR CHATS
    // -----------------------
    ipcMain.handle('fetch-whatsapp-chats', async () => {
        if (!whatsappClient || !whatsappClient.info) {
            return { sucesso: false, erro: 'Cliente WhatsApp desconectado.' };
        }

        try {
            const chats = await whatsappClient.getChats();
            const conversasFormatadas = await Promise.all(chats.map(async (chat) => {
                const idObj = chat.id || {};
                const number = idObj.user || (idObj._serialized ? idObj._serialized.split('@')[0] : 'unknown');

                let contact = null;
                try { contact = await chat.getContact(); } catch (err) { /* ignore */ }

                let profilePicUrl = '';
                try {
                    if (contact && typeof contact.getProfilePicUrl === 'function') {
                        profilePicUrl = await contact.getProfilePicUrl();
                    }
                } catch (err) { /* ignore */ }

                const name = (contact && (contact.name || contact.pushname)) || (chat.name || number);

                return {
                    id: idObj._serialized || number,
                    name,
                    number,
                    isGroup: !!chat.isGroup,
                    lastMessage: chat.lastMessage ? (chat.lastMessage.body || '') : 'Sem mensagens recentes',
                    profilePicUrl: profilePicUrl || ''
                };
            }));

            return { sucesso: true, chats: conversasFormatadas };
        } catch (e) {
            console.error('Erro fetch chats:', e);
            return { sucesso: false, erro: e.message || String(e) };
        }
    });

    // 7) NOVO: Manipulador para buscar o histórico de mensagens de um chat específico
    ipcMain.handle('fetch-chat-history', async (event, number) => {
        if (!whatsappClient || !whatsappClient.info) {
            return { sucesso: false, erro: 'Cliente WhatsApp desconectado.' };
        }

        try {
            const chatId = `${number}@c.us`;
            const chat = await whatsappClient.getChatById(chatId);

            if (!chat) {
                return { sucesso: false, erro: `Chat com ${number} não encontrado.` };
            }

            const messages = await chat.fetchMessages({ limit: 20 });

            const history = messages.map(msg => ({
                texto: msg.body,
                timestamp: new Date(msg.timestamp * 1000).toLocaleTimeString(),
                sender: msg.fromMe ? 'Eu' : (msg.author ? msg.author.split('@')[0] : 'Cliente')
            })).reverse();

            return { sucesso: true, history };
        } catch (e) {
            console.error('[History] Erro ao buscar histórico:', e);
            return { sucesso: false, erro: e.message || String(e) };
        }
    });

    // -----------------------
    // CONFIGURAR CREDENCIAIS
    // -----------------------
    ipcMain.handle('configurar-whatsapp-credentials', (event, { token, phoneNumberId, apiVersion }) => {
        WHATSAPP_TOKEN = token || '';
        PHONE_NUMBER_ID = phoneNumberId || '';
        API_VERSION = apiVersion || API_VERSION;
        console.log('[Config] Credenciais atualizadas');
        return { sucesso: true, status: 'Credenciais atualizadas' };
    });

    // Compatibilidade com outro nome de handler usado no renderer
    ipcMain.handle('configurarCredenciais', (event, { token, phoneNumberId }) => {
        WHATSAPP_TOKEN = token || '';
        PHONE_NUMBER_ID = phoneNumberId || '';
        console.log('[Config] Credenciais atualizadas (alias configurarCredenciais)');
        return { sucesso: true };
    });

    // -----------------------
    // LIMPAR SESSÕES
    // -----------------------
    ipcMain.handle('clear-whatsapp-sessions', async () => {
        const sessionPath = path.join(app.getPath('userData'), 'Local Storage', 'whatsapp-web.js', 'electron-app-session');
        try {
            if (await fs.pathExists(sessionPath)) {
                await fs.remove(sessionPath);
                return { sucesso: true, status: 'Sessões antigas removidas.' };
            } else {
                return { sucesso: true, status: 'Nenhuma sessão antiga encontrada.' };
            }
        } catch (e) {
            return { sucesso: false, erro: e.message || String(e) };
        }
    });

}); // fim app.whenReady()

// Eventos globais
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

function createHistoryWindow() {
    if (historyWindow) {
        historyWindow.focus();
        return;
    }
    historyWindow = new BrowserWindow({
        width: 800,
        height: 700,
        minWidth: 600,
        minHeight: 500,
        webPreferences: {
            preload: path.join(__dirname, 'preload-history.js'), // 🚨 NOVO PRELOAD
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    historyWindow.loadFile('history.html');
    // Limpa a referência ao fechar
    historyWindow.on('closed', () => {
        historyWindow = null;
    });
    // historyWindow.webContents.openDevTools();
}