import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import MainChat from './MainChat';
import './App.css';
import UserContext from './UserContext'; // import the context

function App() {

  const [user, setUser] = useState(null); // Store user data here
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router> {/* Wrap your Routes with Router */}
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/chat" element={<MainChat />} />
        </Routes>
      </Router>
    </UserContext.Provider>
    
  );
}

export default App;

