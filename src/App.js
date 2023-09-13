import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import MainChat from './MainChat';
import './App.css';

function App() {
  return (
    <Router> {/* Wrap your Routes with Router */}
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/chat" element={<MainChat />} />
      </Routes>
    </Router>
  );
}

export default App;

