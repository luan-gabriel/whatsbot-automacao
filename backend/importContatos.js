const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// Lê os contatos do JSON
const contatos = JSON.parse(fs.readFileSync('./contatosExtraidos.json', 'utf8'));

// Conecta (ou cria) o banco de dados
const db = new sqlite3.Database('contatos.db');

// Cria a tabela, se não existir
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS contatos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    avatar TEXT,
    lastMessage TEXT,
    time TEXT
  )`);

  const stmt = db.prepare(`INSERT INTO contatos (name, avatar, lastMessage, time) VALUES (?, ?, ?, ?)`);

  contatos.forEach(contato => {
    stmt.run(contato.name, contato.avatar, contato.lastMessage, contato.time);
  });

  stmt.finalize();
  console.log(`✅ ${contatos.length} contatos inseridos no banco de dados contatos.db`);
});

db.close();
