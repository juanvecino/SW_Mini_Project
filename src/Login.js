import React, { useState, useContext} from 'react';
import GoogleButton from 'react-google-button';
import { auth, provider } from './components/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import UserContext from './UserContext';


const Login = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  function signUp() {
    signInWithPopup(auth, provider)
      .then((result) => {
        // Redirect the user to the chat page after successful sign-in
        const user = result.user;
  
        // Extract name and surname from the displayName
        const fullName = user.displayName || ''; // It's possible for displayName to be null
        const [name, surname] = fullName.split(' ');
        setUser({ name: fullName.split(' ')[0], surname: fullName.split(' ')[1] });
  
        console.log("Name:", name);
        console.log("Surname:", surname);
  
        // Then navigate to chat (or main page) as before
        navigate('/chat');
      })
      .catch((error) => {
        // Handle Errors here.
        // ... (rest of your error handling code)
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
