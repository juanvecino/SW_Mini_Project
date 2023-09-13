// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth} from "firebase/auth";
//import { getDatabase } from "firebase/database";
import { getFirestore} from 'firebase/firestore';



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBprfAnRPmRD2z69XZTu5gLVl1tPLnMnw",
  authDomain: "sw-mini-project-whatsapp.firebaseapp.com",
  projectId: "sw-mini-project-whatsapp",
  storageBucket: "sw-mini-project-whatsapp.appspot.com",
  messagingSenderId: "604252421931",
  appId: "1:604252421931:web:d8aac84f0d029272130f6e",
  measurementId: "G-PY71EDQMBD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider(app);
export const db = getFirestore();
