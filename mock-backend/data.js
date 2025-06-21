const fs = require('fs');

// Lê os contatos extraídos
let contatos = [];
try {
  contatos = JSON.parse(fs.readFileSync('./contatosExtraidos.json', 'utf8'));
} catch (e) {
  console.warn('⚠️ Não foi possível carregar contatosExtraidos.json. Usando contatos fictícios.');

  contatos = [
    {
      name: 'Ana Souza',
      avatar: 'https://i.pravatar.cc/42?u=ana',
      lastMessage: 'Até mais!',
      time: '09:40',
    },
    {
      name: 'Carlos Lima',
      avatar: 'https://i.pravatar.cc/42?u=carlos',
      lastMessage: 'Beleza!',
      time: 'Ontem',
    },
  ];
}

// Cria estrutura de mensagens por contato (vazia inicialmente)
const mensagensPorContato = {};

contatos.forEach(contato => {
  mensagensPorContato[contato.name] = [
    {
      sender: contato.name,
      text: `Olá! Eu sou o bot simulado de ${contato.name}.`,
      time: contato.time || 'Agora',
    }
  ];
});

let botStatus = 'Conectado';

module.exports = {
  contatos,
  mensagensPorContato,
  botStatus
};
