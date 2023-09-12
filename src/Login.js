import React, { useState } from 'react';
import GoogleButton from 'react-google-button';
import {auth, provider} from './components/firebase';
import { signInWithPopup,GoogleAuthProvider} from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  function signUp() {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });

  }

  function signIn() {
    
  }

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
      <GoogleButton onClick={signUp}/>
    </div>
  );
};

export default Login;
