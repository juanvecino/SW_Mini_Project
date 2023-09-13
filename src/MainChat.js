// MainChat.js
import React, { useState, useEffect } from 'react';
import ChatBox from './ChatBox'; // Import the ChatBox component
import './MainChat.css'; // Import the MainChat.css file


const MainChat = () => {
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  // Define recentContacts as an array of contact objects
  const [recentContacts, setRecentContacts] = useState([
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' },
    // Add more contacts as needed
  ]);

  const handleStartChat = (contact) => {
    setActiveChat(contact);
  };

  const handleSendMessage = (message) => {
    // ... Your message sending logic
  };

  return (
    <div className="main-chat-container">
      <div className="chat-sidebar">
        <h2>Recent Contacts</h2>
        <ul className="contact-list">
          {recentContacts.map((contact) => (
            <li key={contact.id}>
              <button onClick={() => handleStartChat(contact)}>{contact.name}</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="chat-panel">
        {activeChat ? (
          <ChatBox
            activeContact={activeChat}
            onSendMessage={handleSendMessage}
            messages={messages}
          />
        ) : (
          <div className="welcome-message">
            <p>Select a contact to start a chat.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainChat;
