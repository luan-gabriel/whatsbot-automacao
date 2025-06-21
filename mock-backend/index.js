const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Lê os contatos extraídos pelo Puppeteer
let contatos = [];
try {
  contatos = JSON.parse(fs.readFileSync('./contatosExtraidos.json', 'utf8'));
} catch (e) {
  console.warn('⚠️ contatosExtraidos.json não encontrado. Usando lista vazia.');
}

// Inicializa mensagens por contato com uma saudação do bot
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

// 🔹 Status do bot
app.get('/api/status', (req, res) => {
  res.json({ status: botStatus });
});

app.post('/api/status', (req, res) => {
  const { status } = req.body;
  if (['Conectado', 'Conectando', 'Desconectado'].includes(status)) {
    botStatus = status;
    return res.json({ success: true });
  }
  res.status(400).json({ error: 'Status inválido' });
});

// 🔹 Lista de contatos
app.get('/api/contacts', (req, res) => {
  res.json(contatos);
});

// 🔹 Envio de mensagem
app.post('/api/send', (req, res) => {
  const { name, text } = req.body;

  if (!name || !text) {
    return res.status(400).json({ error: 'Nome do contato ou texto ausente' });
  }

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const novaMensagem = { sender: 'Você', text, time };

  mensagensPorContato[name] = mensagensPorContato[name] || [];
  mensagensPorContato[name].push(novaMensagem);

  // Simula resposta do bot após 1.5 segundos
  setTimeout(() => {
    const respostas = ['Recebido! 👍', 'Beleza!', 'Já vi aqui.', 'Show!', 'Demorou!'];
    const resposta = {
      sender: name,
      text: respostas[Math.floor(Math.random() * respostas.length)],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    mensagensPorContato[name].push(resposta);
  }, 1500);

  res.json({ success: true });
});

// 🔹 Retorna mensagens de um contato específico
app.get('/api/messages', (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'Parâmetro "name" ausente' });

  const msgs = mensagensPorContato[name] || [];
  res.json(msgs);
});

app.listen(PORT, () => {
  console.log(`🧪 Mock API rodando em http://localhost:${PORT}`);
});
