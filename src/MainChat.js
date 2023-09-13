import React, { useState, useEffect } from 'react';

const MainChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Simulated list of chat messages (replace with your backend or storage solution)
  const initialMessages = [
    { id: 1, text: 'Hello, welcome to the chat!', user: 'Admin' },
  ];

  useEffect(() => {
    // Load initial chat messages (fetch from your backend or storage)
    setMessages(initialMessages);
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      // Simulated user ID (replace with user authentication)
      const userId = 'user123';

      // Create a new message object
      const message = {
        id: messages.length + 1,
        text: newMessage,
        user: userId,
      };

      // Update the messages state with the new message
      setMessages([...messages, message]);

      // Clear the input field
      setNewMessage('');
    }
  };

  return (
    <div className="main-chat-container">
      <h2>Main Chat</h2>
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.user === 'Admin' ? 'admin' : ''}`}>
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

export default MainChat;
