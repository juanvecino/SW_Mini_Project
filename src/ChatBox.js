import React, { useState } from 'react';
import './ChatBox.css'; // Import the ChatBox.css file

const ChatBox = ({ activeContact, onSendMessage, messages }) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      const timestamp = new Date().toLocaleTimeString(); // Get the current time
      onSendMessage(newMessage, timestamp);
      setNewMessage('');
    }
  };

  return (
    <div className="chat-box">
      <div className="chat-header">
        <h2>Chat with {activeContact.name}</h2>
      </div>
      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.timestamp}
            className={`message ${message.user === 'Admin' ? 'admin' : ''}`}
          >
            <p>
              <span className="message-user">{message.user}</span>
              <span className="message-timestamp"> {message.timestamp}</span> {/* Add a space before timestamp */}
            </p>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
