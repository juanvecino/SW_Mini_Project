import React, { useState } from 'react';
import GoogleButton from 'react-google-button';
import { auth, provider } from './components/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Login.css';


const Login = () => {
  const navigate = useNavigate();

  function signUp() {
    signInWithPopup(auth, provider)
      .then((result) => {
        // Redirect the user to the chat page after successful sign-in
        const user = result.user;
        navigate('/chat');
      })
      .catch((error) => {
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

  // ... (rest of your code)

  return (
    <div className="login-container">
      <div className="centered-content">
        <h2>Welcome to WebChat</h2>
        <div className="google-signin">
          <GoogleButton onClick={signUp} />
        </div>
      </div>
    </div>
  );
};

export default Login;
