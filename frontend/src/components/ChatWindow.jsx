import React, { useState, useEffect } from 'react';
import MessageInput from './MessageInput';

export default function ChatWindow({ contact, messages, onSend }) {
  const [status, setStatus] = useState('Conectando');

  useEffect(() => {
    fetch('http://localhost:3001/api/status')
      .then((res) => res.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('Desconectado'));
  }, []);

  if (!contact) {
    return <div className="chat-window empty">Selecione um contato para começar</div>;
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <img src={contact.avatar} alt="avatar" className="avatar" />
        <strong>{contact.name}</strong>
      </div>

      <div className="bot-status">
        <span>Status do bot: {status}</span>
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.sender === 'Você' ? 'sent' : 'received'}`}
          >
            <span>{msg.text}</span>
            <em>{msg.time}</em>
          </div>
        ))}
      </div>

      <MessageInput onSend={onSend} />
    </div>
  );
}
