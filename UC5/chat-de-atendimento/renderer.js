let isConnected = false;
let activeChatNumber = null;
let conversations = {}; // Armazena o histórico por número de telefone

document.addEventListener('DOMContentLoaded', () => {
// Referências do DOM
const statusText = document.getElementById('status-text');
const btnSettings = document.getElementById('btn-settings');
const settingsModal = document.getElementById('settings-modal');
const btnCancelSettings = document.getElementById('btn-cancel-settings');
const connectionForm = document.getElementById('connection-form');
const inputToken = document.getElementById('input-token');
const inputPhoneId = document.getElementById('input-phone-id');
const conversationsContainer = document.getElementById('conversations-container');
const mensagensDiv = document.getElementById('mensagens');
const chatForm = document.getElementById('chat-form');
const chatHeader = document.getElementById('chat-header');
const activeChatName = document.getElementById('active-chat-name');
const activeChatNumberEl = document.getElementById('active-chat-number');
const mensagemInput = document.getElementById('mensagem-input');
const placeholderChat = document.getElementById('placeholder-chat');

// Referências do QR Code
const btnGenerateQR = document.getElementById('btn-generate-qr');
const btnConnectQR = document.getElementById('btn-connect-qr');
const qrcodeImage = document.getElementById('qrcode-image');
const qrcodeMessage = document.getElementById('qrcode-message');



// --- FUNÇÕES DE UTILITY ---

function updateConnectionStatus(connected) {
    isConnected = connected;
    const statusEl = document.getElementById('connection-status');

    if (connected) {
        statusText.textContent = '✅ Conectado';
        statusText.classList.remove('text-red-600');
        statusText.classList.add('text-green-600');
        statusEl.classList.add('bg-green-100');
        statusEl.classList.remove('bg-red-100');
        // Carrega a lista inicial de conversas
        renderConversationsList();
    } else {
        statusText.textContent = '❌ Desconectado';
        statusText.classList.remove('text-green-600');
        statusText.classList.add('text-red-600');
        statusEl.classList.remove('bg-green-100');
        statusEl.classList.add('bg-red-100');
    }
}

function renderConversationsList() {
    conversationsContainer.innerHTML = '';
    const sortedNumbers = Object.keys(conversations).sort((a, b) => {
        // Ordena pelo número de mensagens não lidas primeiro
        return conversations[b].unread - conversations[a].unread;
    });

    sortedNumbers.forEach(number => {
        const convo = conversations[number];
        const isActive = number === activeChatNumber;
        
        const item = document.createElement('div');
        item.className = `p-4 flex justify-between items-center cursor-pointer border-b border-gray-100 transition duration-150 ${isActive ? 'bg-teal-100 border-l-4 border-teal-500' : 'hover:bg-gray-100'}`;
        item.dataset.number = number;
        
        // Determina o último texto ou um texto padrão
        const lastMessage = convo.history.length > 0 
            ? convo.history[convo.history.length - 1].texto.substring(0, 30) + (convo.history[convo.history.length - 1].texto.length > 30 ? '...' : '')
            : 'Nova conversa';

        item.innerHTML = `
            <div>
                <p class="font-semibold text-gray-800">${convo.name}</p>
                <p class="text-xs text-gray-500">${lastMessage}</p>
            </div>
            ${convo.unread > 0 ? `<span class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">${convo.unread}</span>` : ''}
        `;
        
        item.addEventListener('click', () => setActiveChat(number));
        conversationsContainer.appendChild(item);
    });
}

function setActiveChat(number) {
    // Ignora se for o chat já ativo
    if (activeChatNumber === number) {
        // Garante que o contador seja zerado se já estiver ativo
        if (conversations[number].unread > 0) {
            conversations[number].unread = 0;
            renderConversationsList();
        }
        return;
    }

    activeChatNumber = number;
    
    // Remove a classe de ativo da conversa anterior (se houver)
    document.querySelectorAll('#conversations-container > div').forEach(el => {
        el.classList.remove('bg-teal-100', 'border-l-4', 'border-teal-500');
    });

    // Marca a nova conversa como ativa e limpa não lidas
    const activeEl = document.querySelector(`[data-number="${number}"]`);
    if (activeEl) {
        activeEl.classList.add('bg-teal-100', 'border-l-4', 'border-teal-500');
    }
    
    conversations[number].unread = 0; // Zera as não lidas
    renderConversationsList(); // Atualiza a lista para remover o contador
    
    // Atualiza cabeçalho e exibe o formulário
    placeholderChat.classList.add('hidden');
    chatHeader.classList.remove('hidden');
    chatForm.classList.remove('hidden');

    activeChatName.textContent = conversations[number].name;
    activeChatNumberEl.textContent = number;
    
    renderChatMessages();
}

function renderChatMessages() {
    mensagensDiv.innerHTML = '';
    if (!activeChatNumber) return;

    const history = conversations[activeChatNumber].history;

    history.forEach(msg => {
        const isMe = msg.sender === 'Eu';
        const bubbleClass = isMe 
            ? 'bg-blue-500 text-white self-end rounded-br-none' 
            : 'bg-white text-gray-800 self-start rounded-tl-none border border-gray-200';
        
        const msgEl = document.createElement('div');
        msgEl.className = `max-w-xs md:max-w-md p-3 my-2 rounded-xl shadow-sm ${bubbleClass}`;
        msgEl.textContent = msg.texto;
        mensagensDiv.appendChild(msgEl);
    });
    
    mensagensDiv.scrollTop = mensagensDiv.scrollHeight; // Rola para a última mensagem
}

function addMessageToHistory(number, message, sender, isIncoming) {
    if (!conversations[number]) {
        // Cria uma nova conversa se o número for novo (simulação ou real)
        conversations[number] = {
            // Tenta usar o nome da mensagem recebida ou define um nome padrão
            name: message.name || `Cliente (${number.substring(number.length - 4)})`, 
            number: number,
            history: [],
            unread: 0 
        };
    }
    
    conversations[number].history.push({ 
        texto: message.texto, 
        sender: sender, 
        timestamp: new Date().toLocaleTimeString() 
    });

    if (isIncoming && number !== activeChatNumber) {
        conversations[number].unread++;
    } else if (isIncoming && number === activeChatNumber) {
         // Se estiver no chat ativo, não marca como não lida, mas atualiza a lista
         renderChatMessages();
    }

    // Atualiza a lista de conversas sempre que uma mensagem chega
    renderConversationsList(); 
    
    // Se a mensagem for de um cliente e o chat estiver ativo, renderiza as mensagens
    if (number === activeChatNumber) {
         renderChatMessages(); 
    }
}


// --- LISTENERS ---

// 1. Lógica de Envio de Mensagem (Formulário)
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!isConnected || !activeChatNumber) return;

    const mensagem = mensagemInput.value.trim();
    if (!mensagem) return;

    // Adiciona a mensagem ao histórico imediatamente
    addMessageToHistory(activeChatNumber, { texto: mensagem }, 'Eu', false);
    mensagemInput.value = ''; // Limpa o input

    // Chama a API segura exposta pelo Preload
    try {
        const resultado = await window.whatsappAPI.enviarMensagem(activeChatNumber, mensagem);

        if (resultado.sucesso) {
            console.log('Mensagem enviada com sucesso para a API:', resultado.dados);
        } else {
            // Em caso de erro na API, adiciona uma notificação de erro ao chat
            addMessageToHistory(activeChatNumber, { texto: `[ERRO] Falha no envio: ${resultado.erro.slice(0, 50)}...` }, 'Sistema', false);
        }
    } catch (error) {
        addMessageToHistory(activeChatNumber, { texto: `[ERRO] Falha interna: ${error.message}` }, 'Sistema', false);
    }
});

// 2. Lógica de Configuração (Modal)
btnSettings.addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
});

btnCancelSettings.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
});

// Submissão do Formulário Meta API
connectionForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = inputToken.value.trim();
    const phoneId = inputPhoneId.value.trim();

    if (!token || !phoneId) return;

    document.getElementById('btn-connect').textContent = 'Conectando...';
    
    // Chama a API segura para configurar as credenciais no Main
    try {
        const resultado = await window.whatsappAPI.configurarCredenciais(token, phoneId);

        if (resultado.sucesso) {
            updateConnectionStatus(true);
            settingsModal.classList.add('hidden');
            console.log(`API configurada e conectada! Status: ${resultado.status}`);
        } else {
            // Substituído alert() por log de erro
            console.error(`Erro de Conexão: ${resultado.erro}`);
            updateConnectionStatus(false);
        }
    } catch (error) {
         console.error(`Erro interno do Electron: ${error.message}`);
         updateConnectionStatus(false);
    } finally {
        document.getElementById('btn-connect').textContent = 'Conectar API';
    }
});

// Lógica do QR Code
btnGenerateQR.addEventListener('click', () => {
    // Simulação: O Main solicitaria a geração do QR Code e retornaria a URL da imagem.
    // Aqui, apenas trocamos os elementos da UI.
    btnGenerateQR.classList.add('hidden');
    qrcodeImage.classList.remove('hidden');
    qrcodeMessage.textContent = 'Escaneie o código com seu celular. Não feche esta tela!';
    btnConnectQR.classList.remove('hidden');
    
    // Simulação de chamada IPC para o Main (que iniciaria o processo de QR code)
    // window.whatsappAPI.solicitarQRCode(); 
});

btnConnectQR.addEventListener('click', () => {
    // Simulação: O Main confirmaria a conexão após o escaneamento.
    updateConnectionStatus(true);
    settingsModal.classList.add('hidden');
    console.log('Conexão estabelecida via QR Code (Simulado).');
});


// 3. Lógica de Recepção de Mensagens (Vindo do Main via Webhook Simulado)
window.whatsappAPI.onNovaMensagemRecebida((novaMensagem) => {
    // novaMensagem: { texto: "...", name: "...", number: "..." }
    console.log("Recebendo nova mensagem do Main:", novaMensagem);
    
    // Adiciona a mensagem ao histórico e atualiza a UI
    addMessageToHistory(novaMensagem.number, novaMensagem, novaMensagem.name, true);
});

// Inicialização
updateConnectionStatus(isConnected);


});