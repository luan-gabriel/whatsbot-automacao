import React, { useState, useEffect } from 'react';
import ContactList from './components/ContactList';
import ChatWindow from './components/ChatWindow';
import './App.css';

export default function App() {
  const [contatos, setContatos] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [mensagens, setMensagens] = useState([]);

  // Carrega a lista de contatos reais do backend
  useEffect(() => {
    fetch('http://localhost:3001/api/contacts')
      .then((res) => res.json())
      .then((data) => setContatos(data))
      .catch((err) => console.error('Erro ao carregar contatos:', err));
  }, []);

  // Carrega mensagens quando um contato for selecionado
  useEffect(() => {
    if (selectedContact) {
      fetch(`http://localhost:3001/api/messages?name=${encodeURIComponent(selectedContact.name)}`)
        .then((res) => res.json())
        .then((data) => setMensagens(data))
        .catch((err) => console.error('Erro ao carregar mensagens:', err));
    }
  }, [selectedContact]);

  const handleSend = async (text) => {
    if (!text || !selectedContact) return;

    const novaMensagem = {
      sender: 'Você',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMensagens((prev) => [...prev, novaMensagem]);

    await fetch('http://localhost:3001/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: selectedContact.name,
        text: text,
      }),
    });

    // Atualiza mensagens depois que o "bot" responder
    setTimeout(async () => {
      const res = await fetch(`http://localhost:3001/api/messages?name=${encodeURIComponent(selectedContact.name)}`);
      const data = await res.json();
      setMensagens(data);
    }, 2000);
  };

  const handleSelectContact = (contact) => {
    if (!contact || !contact.name) return;
    setSelectedContact(contact);
  };

  return (
    <div className="app-container">
      <ContactList contacts={contatos} onSelect={handleSelectContact} />
      <ChatWindow contact={selectedContact} messages={mensagens} onSend={handleSend} />
    </div>
  );
}
