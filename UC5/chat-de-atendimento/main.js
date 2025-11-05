const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');
const WebSocket = require('ws'); // Necessário para a comunicação em tempo real
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

// --- Variáveis Globais Mutáveis (Configuradas pelo Frontend) ---
let WHATSAPP_TOKEN = '';
let PHONE_NUMBER_ID = ''; // Ou o número de telefone de teste
let API_VERSION = 'v19.0';
let mainWindow = null;

// --- WEBSOCKET ---
const WS_SERVER_URL = 'ws://localhost:8080';
let ws = null;

// --- whatsapp-web.js client ---
let whatsappClient = null;

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

// --- LÓGICA DE ENVIO PARA A API DO WHATSAPP (Cloud API) ---
async function enviarMensagemWhatsApp(numeroDestino, mensagem) {
    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
        throw new Error('As credenciais da API do WhatsApp não estão configuradas. Por favor, conecte-se via Configurações.');
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
    // mainWindow.webContents.openDevTools();
}

// --- INICIALIZAÇÃO DO ELECTRON (UNIFICADA) ---
app.whenReady().then(() => {
    createWindow();
    connectWebSocket();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    // 1) Configurar credenciais Cloud API
   // NO ARQUIVO: main.js
// ... (dentro de app.whenReady().then(() => { ... }) ) ...
// NO ARQUIVO: main.js
// ... (dentro de app.whenReady().then(() => { ... }) ) ...

// 2) Iniciar fluxo de QR Code (whatsapp-web.js)
ipcMain.handle('iniciar-qr-code-flow', async () => {

    // 🚨 PASSO 1: Destruir o cliente antigo se ele existir
    if (whatsappClient) {
        console.log('[QR] Cliente existente detectado. Tentando limpar e destruir...');
        try {
            await whatsappClient.destroy();
            console.log('[QR] Cliente destruído com sucesso.');
        } catch (e) {
            console.warn('[QR] Aviso: Erro ao destruir cliente, pode não estar ativo, prosseguindo com limpeza. ', e.message);
        }
        whatsappClient = null;
    }

    // 🚨 PASSO 2: Limpeza Forçada dos Arquivos de Sessão (NOVO BLOCO)
    const sessionPath = path.join(app.getPath('userData'), 'Default', 'session', 'session-electron-app-session');

    try {
        if (fs.existsSync(sessionPath)) {
            await fs.remove(sessionPath);
            console.log('[QR] Pasta de sessão antiga removida com sucesso para forçar novo QR Code.');
        }
    } catch (e) {
        console.error('[QR] Erro ao remover pasta de sessão:', e.message);
    }
    // FIM DA LIMPEZA FORÇADA

    // 🚨 PASSO 3: Criar um novo cliente whatsapp-web.js (com listeners)

    console.log('[QR] Inicializando Novo Cliente do WhatsApp Web...');

    // 🚨 ALERTA: Definindo caminho fixo do Edge para QRCode
    const browserExecutablePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

    whatsappClient = new Client({
        authStrategy: new LocalAuth({ clientId: 'electron-app-session' }),
        puppeteer: {
            executablePath: browserExecutablePath,
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        }
    });

    // 🚨 LISTENER 1: QR Code Recebido (CRUCIAL PARA EXIBIR)
    whatsappClient.on('qr', async (qr) => {
        console.log('[QR] Código QR recebido, gerando imagem DataURL...');
        try {
            const qrDataURL = await qrcode.toDataURL(qr);
            if (mainWindow) {
                mainWindow.webContents.send('qr-code-data', qrDataURL);
            }
        } catch (error) {
            console.error('[QR] Erro ao gerar DataURL do QR Code:', error.message);
        }
    });

    // 🚨 LISTENER 2: Cliente Pronto (CONEXÃO ESTABELECIDA)
    whatsappClient.on('ready', () => {
        console.log('[QR] Cliente WhatsApp conectado e pronto!');
        if (mainWindow) {
            mainWindow.webContents.send('whatsapp-ready');
        }
    });

    // 🚨 LISTENER 3: Mensagem Recebida (PARA RECEBER MENSAGENS NO CHAT)
    whatsappClient.on('message', async msg => {
        console.log('[QR] Nova mensagem do WhatsApp recebida.');
        // O Main Process também precisa buscar as informações de contato para retransmitir o nome
        const contact = await msg.getContact(); 
        const number = msg.from.split('@')[0];

        if (mainWindow) {
            const novaMensagem = {
                texto: msg.body,
                name: contact.name || contact.pushname || number, // Nome do contato
                number: number
            };
            mainWindow.webContents.send('nova-mensagem-recebida', novaMensagem);
        }
    }); // <--- CHAVE DE FECHAMENTO DO .on('message', ...)

    // 🚨 PASSO 3: Inicializar o cliente
    whatsappClient.initialize().catch(e => console.error('[QR] Erro de inicialização do cliente:', e));
    return { sucesso: true, status: 'Fluxo de QR Code iniciado' };
}); // <--- CHAVE DE FECHAMENTO DO IPC.HANDLE ('iniciar-qr-code-flow')

// ... (o restante do código, como ipcMain.handle('send-whatsapp-message', ...), segue normalmente) ...

    // 3) Enviar mensagem (unificado: simulação, whatsapp-web.js ou Cloud API)
    ipcMain.handle('send-whatsapp-message', async (event, { numero, mensagem }) => {
        try {
            // Simulação com token de teste
            if (WHATSAPP_TOKEN && WHATSAPP_TOKEN.startsWith('TOKEN_DE_TESTE_')) {
                console.log(`[SIMULAÇÃO] Mensagem para ${numero} enviada.`);
                return { sucesso: true, dados: { status: 'simulado' } };
            }

            // Se cliente whatsapp-web.js está pronto, use-o
            if (whatsappClient && whatsappClient.info) {
                await whatsappClient.sendMessage(`${numero}@c.us`, mensagem);
                return { sucesso: true, dados: { status: 'enviado-qr' } };
            }

            // Caso contrário, fallback para Cloud API
            const resultado = await enviarMensagemWhatsApp(numero, mensagem);
            return { sucesso: true, dados: resultado };

        } catch (erro) {
            return { sucesso: false, erro: erro.message };
        }
    });

    // Outros handlers IPC podem ser adicionados aqui...


// Encerra o aplicativo quando todas as janelas forem fechadas (exceto no macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// 4. Manipulador para buscar a lista de conversas ativas
ipcMain.handle('fetch-whatsapp-chats', async () => {
    if (!whatsappClient || !whatsappClient.info) {
        return { sucesso: false, erro: 'Cliente WhatsApp desconectado.' };
    }

    try {
        const chats = await whatsappClient.getChats();

        const conversasFormatadas = await Promise.all(chats.map(async (chat) => {
            // segurança: id e user podem não existir em alguns casos
            const idObj = chat.id || {};
            const number = idObj.user || (idObj._serialized ? idObj._serialized.split('@')[0] : 'unknown');

            // tenta obter contato (nome, pushname e foto)
            let contact = null;
            try {
                contact = await chat.getContact();
            } catch (err) {
                console.warn(`[fetch-whatsapp-chats] Não foi possível obter contato para ${number}: ${err.message}`);
            }

            let profilePicUrl = '';
            try {
                if (contact && typeof contact.getProfilePicUrl === 'function') {
                    profilePicUrl = await contact.getProfilePicUrl();
                }
            } catch (err) {
                console.warn(`[fetch-whatsapp-chats] Falha ao obter foto de ${number}: ${err.message}`);
            }

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
        console.error('[fetch-whatsapp-chats] Erro ao buscar chats:', e);
        return { sucesso: false, erro: e && e.message ? e.message : String(e) };
    }
});
});

const fs = require('fs-extra'); // 🚨 NOVO
// ...
// 5. Manipulador para limpar sessões antigas (whatsapp-web.js)
ipcMain.handle('clear-whatsapp-sessions', async () => {
    const sessionPath = path.join(app.getPath('userData'), 'Local Storage', 'whatsapp-web.js', 'electron-app-session'); 
    try {
        if (fs.existsSync(sessionPath)) {
            await fs.remove(sessionPath);
            console.log('[clear-whatsapp-sessions] Sessões antigas removidas com sucesso.');
            return { sucesso: true, status: 'Sessões antigas removidas.' };
        } else {
            console.log('[clear-whatsapp-sessions] Nenhuma sessão antiga encontrada para remover.');
            return { sucesso: true, status: 'Nenhuma sessão antiga encontrada.' };
        }
    } catch (e) {
        console.error('[clear-whatsapp-sessions] Erro ao remover sessões antigas:', e);
        return { sucesso: false, erro: e.message };
    }
});
ipcMain.handle('configurar-whatsapp-credentials', (event, { token, phoneNumberId, apiVersion }) => {
    WHATSAPP_TOKEN = token;
    PHONE_NUMBER_ID = phoneNumberId;
    API_VERSION = apiVersion || 'v19.0';

    console.log('[Configuração] Credenciais da API do WhatsApp atualizadas pelo frontend.');
    return { sucesso: true, status: 'Credenciais atualizadas' };
}
);
