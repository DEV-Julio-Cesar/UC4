# 📋 Gerenciador de Tarefas

Um aplicativo simples e elegante para criar e salvar tarefas, desenvolvido com Electron.

## ✨ Funcionalidades

- ➕ **Criar Tarefas**: Adicione tarefas com título e descrição opcional
- 💾 **Salvamento Automático**: Suas tarefas são salvas automaticamente em um arquivo JSON local
- 📤 **Exportar Tarefas**: Exporte suas tarefas para um arquivo externo
- 🎨 **Interface Moderna**: Design elegante e responsivo com animações suaves
- ⚡ **Atalhos de Teclado**: 
  - `Ctrl + N`: Focar no campo de nova tarefa
  - `Ctrl + E`: Exportar tarefas
  - `Enter`: Adicionar tarefa quando estiver no campo de título

## 🚀 Como Executar

1. **Instalar dependências:**
   ```powershell
   npm install
   ```

2. **Executar o aplicativo:**
   ```powershell
   npx electron .
   ```
   
3. **Para desenvolvimento com reload automático:**
   ```powershell
   npm run dev
   ```
   ou
   ```powershell
   npx electronmon .
   ```

4. **Scripts disponíveis:**
   - `npm run dev` - Executa com reload automático
   - `npm test` - Executa o aplicativo
   - `npx electron .` - Execução direta (mais confiável)

## 📱 Como Usar

### Adicionando Tarefas
1. Digite o título da tarefa no campo "Título da Tarefa"
2. (Opcional) Adicione uma descrição no campo de descrição
3. Clique em "Adicionar" ou pressione `Enter`

### Exportando Tarefas
1. Clique no botão "Exportar" 
2. Escolha o local onde deseja salvar o arquivo
3. Suas tarefas serão exportadas em formato JSON

## 🗂️ Estrutura de Arquivos

```
gerenciador-de-tarefas/
│
├── main.js          # Processo principal do Electron
├── preload.js       # Ponte segura entre main e renderer
├── index.html       # Interface do usuário
├── renderer.js      # Lógica da interface
├── package.json     # Configurações do projeto
├── tarefas.json     # Arquivo onde as tarefas são salvas (criado automaticamente)
└── README.md        # Este arquivo
```

## 💾 Armazenamento de Dados

As tarefas são salvas automaticamente em um arquivo `tarefas.json` na pasta do projeto. Cada tarefa contém:

- **ID único**: Baseado em timestamp
- **Título**: Texto principal da tarefa
- **Descrição**: Detalhes opcionais da tarefa  
- **Data de Criação**: Quando a tarefa foi criada
- **Data de Modificação**: Última alteração

## 🎨 Características da Interface

- **Design Responsivo**: Funciona bem em diferentes tamanhos de tela
- **Gradiente Animado**: Fundo com gradiente que se move suavemente
- **Cartões de Tarefa**: Cada tarefa é exibida em um cartão elegante
- **Animações Suaves**: Transições e animações para melhor experiência
- **Glassmorphism**: Efeito de vidro fosco na interface

## 🔧 Tecnologias Utilizadas

- **Electron**: Framework para aplicações desktop
- **HTML5 & CSS3**: Interface moderna e responsiva
- **JavaScript ES Modules**: Código modular e organizado
- **Font Awesome**: Ícones elegantes
- **Google Fonts**: Tipografia Poppins

## 🚀 Versão

**Versão 1.0.0** - Funcionalidades básicas de criação e salvamento de tarefas

---

💡 **Dica**: Este gerenciador foi desenvolvido de forma simples e focada apenas em criar e salvar tarefas, mantendo a interface limpa e funcional!
