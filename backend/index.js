const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { enviarMensagemViaPuppeteer } = require('./puppeteerBot');
const { startWhatsApp } = require('./puppeteerBot');

startWhatsApp().then(() => {
  console.log('🤖 Sessão do WhatsApp pronta para envio de mensagens.');
}).catch((err) => {
  console.error('❌ Erro ao iniciar o WhatsApp Web:', err);
});



const app = express();
const PORT = 3001;

// Lê os contatos extraídos pelo Puppeteer
let contatos = [];
try {
  contatos = JSON.parse(fs.readFileSync('./contatosExtraidos.json', 'utf8'));
} catch (e) {
  console.warn('⚠️ contatosExtraidos.json não encontrado. Usando lista vazia.');
}

// Inicializa mensagens por contato com uma mensagem de saudação
const mensagensPorContato = {};
contatos.forEach(c => {
  mensagensPorContato[c.name] = [
    {
      sender: c.name,
      text: `Olá! Eu sou o bot fictício de ${c.name}.`,
      time: c.time || 'Agora'
    }
  ];
});

let botStatus = 'Conectado';

app.use(cors());
app.use(express.json());
app.use('/avatars', express.static('./avatars'));


// 🔹 Endpoint: lista de contatos
app.get('/api/contacts', (req, res) => {
  res.json(contatos);
});

// 🔹 Envio de mensagem
app.post('/api/send', async (req, res) => {
  const { name, text } = req.body;

  if (!name || !text) {
    return res.status(400).json({ error: 'Nome do contato ou texto ausente' });
  }

  const enviado = await enviarMensagemViaPuppeteer(name, text);

  if (!enviado) {
    return res.status(500).json({ error: 'Falha ao enviar mensagem via Puppeteer' });
  }

  res.json({ success: true });
});


// 🔹 Busca mensagens de um contato específico
app.get('/api/messages', (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'Parâmetro "name" ausente' });

  const msgs = mensagensPorContato[name] || [];
  res.json(msgs);
});

// 🔹 Consulta status do bot
app.get('/api/status', (req, res) => {
  res.json({ status: botStatus });
});

// 🔹 Atualiza status do bot
app.post('/api/status', (req, res) => {
  const { status } = req.body;
  if (['Conectado', 'Conectando', 'Desconectado'].includes(status)) {
    botStatus = status;
    return res.json({ success: true });
  }
  res.status(400).json({ error: 'Status inválido' });
});

app.listen(PORT, () => {
  console.log(`🧪 Mock API rodando em http://localhost:${PORT}`);
});
