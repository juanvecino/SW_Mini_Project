// MainChat.js
import React, { useState } from 'react';
import ChatBox from './ChatBox'; // Import the ChatBox component
import './MainChat.css'; // Import the MainChat.css file

const MainChat = () => {
  const [activeContact, setActiveContact] = useState(null);
  const [chatHistory, setChatHistory] = useState({});

  // Define recentContacts as an array of contact objects
  const [recentContacts, setRecentContacts] = useState([
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' },
    // Add more contacts as needed
  ]);

  const handleStartChat = (contact) => {
    setActiveContact(contact);
    // Initialize chat history for the selected contact
    if (!chatHistory[contact.id]) {
      setChatHistory({
        ...chatHistory,
        [contact.id]: [],
      });
    }
  };

  const handleSendMessage = (message, timestamp) => {
    const currentChatHistory = chatHistory[activeContact.id];
    const updatedChatHistory = [...currentChatHistory, { text: message, user: 'You', timestamp }];
    setChatHistory({
      ...chatHistory,
      [activeContact.id]: updatedChatHistory,
    });
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
        {activeContact ? (
          <ChatBox
            activeContact={activeContact}
            onSendMessage={handleSendMessage}
            messages={chatHistory[activeContact.id] || []}
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
