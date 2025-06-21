import React from 'react';

export default function ContactList({ onSelect, contacts }) {
  return (
    <div className="contact-list">
      {contacts.map((contact, index) => (
        <div
          key={index}
          className="contact-item"
          onClick={() => onSelect(contact)}
        >
          <img src={contact.avatar} alt="avatar" className="avatar" />
          <div className="contact-info">
            <strong>{contact.name}</strong>
            <span className="last-message">{contact.lastMessage}</span>
          </div>
          <span className="time">{contact.time}</span>
        </div>
      ))}
    </div>
  );
}
