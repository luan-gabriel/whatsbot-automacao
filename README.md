# 💬 WhatsBot Automação

Um projeto completo de automação com WhatsApp Web, combinando **Puppeteer**, **Node.js**, **React**, **SQLite** e um toque de genialidade.

---

## ✅ Funcionalidades

### 📸 Automação com Puppeteer
- Abre o WhatsApp Web com navegador visível (`headless: false`)
- Aguarda login manual via QR Code
- Extrai nome, última mensagem e horário dos contatos
- Gera avatares fictícios via DiceBear com base no nome
- Salva todos os dados em `contatosExtraidos.json`

### 💾 Banco de Dados SQLite
- Script `importContatos.js` insere contatos no banco `contatos.db`
- Tabela `contatos` contendo:
  - `name` — nome do contato
  - `avatar` — link do avatar gerado
  - `lastMessage` — última mensagem visível
  - `time` — horário da última mensagem

### 💻 Interface Web com React
- Lista contatos reais com avatares dinâmicos
- Carrega conversas simuladas individualmente
- Campo de digitação com envio de mensagens

### 🤖 Envio Real via Puppeteer
- Seleciona a conversa no WhatsApp Web real
- Digita o texto enviado pela interface web
- Clica no botão de envio automaticamente

---

## 🚀 Como Executar

1. Instale as dependências:

```bash
npm install

Inicie tudo com um único comando:
npm run bootstrap

Esse comando irá:

Abrir o WhatsApp Web no navegador

Aguardar login via QR Code

Extrair os contatos da interface

Atribuir avatares fictícios

Iniciar frontend e backend simultaneamente

Acesse o sistema em: http://localhost:3000

🧪 Tecnologias Utilizadas
Puppeteer

React

Node.js

Express

SQLite

fs-extra

DiceBear Avatars

 Créditos
Desenvolvido por Luan Gabriel Alves — com apoio do copiloto mais dedicado da internet 😎

❌ Por que o Puppeteer não consegue coletar e armazenar todas as mensagens de um contato no WhatsApp Web?
Embora o Puppeteer consiga interagir com o WhatsApp Web de forma visual e automatizada, a coleta completa e confiável do histórico de mensagens de uma conversa enfrenta limitações técnicas importantes:

Renderização dinâmica e virtual scroll:
O WhatsApp Web não carrega todas as mensagens de uma vez. Apenas um pequeno trecho do histórico é exibido no DOM por vez.

Mensagens antigas não estão acessíveis no DOM:
Mesmo com automações de rolagem, o conteúdo é constantemente destruído e reconstruído pela aplicação.

Proteções contra automação:
O WhatsApp Web detecta interações não-humanas, podendo causar bloqueios de sessão ou travamentos.

Limitações de performance e consistência:
Scrolls simulados podem ser lentos, inconsistentes e até causar perda de mensagens.

✅ Alternativa adotada:
Diante dessas limitações, o projeto armazena apenas as últimas mensagens visíveis no preview dos contatos (nome, último texto e horário), garantindo:


Ordenação dos contatos por atividade
Possibilidade de resposta automatizada