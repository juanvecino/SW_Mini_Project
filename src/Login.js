import React, { useContext } from 'react';
import GoogleButton from 'react-google-button';
import { auth, provider } from './components/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import UserContext from './UserContext';
import { getDatabase, ref, update, get } from "firebase/database";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  function signInOrSignUp() {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        
        // Check if user already exists in Firebase
        const userRef = ref(getDatabase(), `/persons/${user.uid}`);
        get(userRef)
          .then(snapshot => {
            if (snapshot.exists()) {
              // If user already exists, just set the user data in context
              setUser(snapshot.val());
              navigate('/chat');
            } else {
              // If user doesn't exist, create new user data and update Firebase
              const userData = {
                id_person: user.uid,
                name: user.displayName.split(' ')[0],
                surname: user.displayName.split(' ')[1] || "",
                id_rooms: [],
                email: user.email,
              };
              
              setUser(userData);
              
              // Save new user to Firebase
              update(userRef, userData);
              navigate('/chat');
            }
          });
      })
      .catch((error) => {
        // Handle Errors here.
        console.error("Login/Signup error:", error);
      });
  }

  return (
    <div className="login-container">
      <div className="centered-content">
        <h2>Welcome to WebChat</h2>
        <div className="google-signin">
          <GoogleButton onClick={signInOrSignUp} />
        </div>
      </div>
    </div>
  );
};

export default Login;
