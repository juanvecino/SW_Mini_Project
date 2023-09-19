// ChatBox.js
import React, { useState, useRef, useEffect } from 'react';
import './ChatBox.css'; // Import the ChatBox.css file

const ChatBox = ({ activeContact, onSendMessage, messages }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);


  useEffect(() => {
    // Desplazarse al fondo del contenedor de mensajes
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const formatDate = (timestamp) => {
    console.log('formatDate', timestamp);
    const date = new Date(timestamp);
    return isNaN(date) ? "Invalid Date" : date.toLocaleString();
  };

  return (
    <div className="chat-box">
      <div className="chat-header">
        <h2>Chat with {activeContact.name} {activeContact.surname}</h2>
      </div>
      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.time}
            className={`message ${message.senderId === activeContact.id_person ? 'contact' : 'self'}`}
          >
            <p>
              <span className="message-user">{message.user}</span>
              <span className="message-timestamp"> {formatDate(message.time)}</span>
            </p>
            <p>{message.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef}></div> {/* Este div actúa como un ancla al final del chat */}
      </div>
      <div className="message-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && newMessage.trim() !== '') {
              handleSendMessage();
              e.preventDefault();  // Evitar un salto de línea en el input
            }
          }}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
