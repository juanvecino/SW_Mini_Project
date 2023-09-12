import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Implement your authentication logic here
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className="login-container">
        <h2>Welcome to WebChat</h2>
      <h2>Login with Google Account</h2>
      <div className="form-group">
        <label>Gmail: </label>
        <input
          type="text"
          placeholder="Enter your Gmail address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Password: </label>
        <input
          type="password"
          placeholder="Enter your Gmail password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="login-button" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default Login;
