import React, {useContext} from 'react';
import GoogleButton from 'react-google-button';
import { auth, provider } from './components/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import UserContext from './UserContext';
import { getDatabase, ref, update } from "firebase/database";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  function signUp() {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;

      const userData = {
        id_person: user.uid,
        name: user.displayName.split(' ')[0],
        surname: user.displayName.split(' ')[1] || "",
        id_rooms: ['-NeEVC8fW1EI7ccM16MQ'],
        email: user.email,
      };

      setUser(userData);
      
      // Save user to Firebase
      update(ref(getDatabase(), `/persons/${user.uid}`), userData);

      navigate('/chat');
      })
      .catch((error) => {
        // Handle Errors here.
      });
  }

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
