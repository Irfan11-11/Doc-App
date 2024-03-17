import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyCfjqI2v9s-yKTz2KOVI01-NauJBfopHnU",
  authDomain: "docapp-9e9ff.firebaseapp.com",
  projectId: "docapp-9e9ff",
  storageBucket: "docapp-9e9ff.appspot.com",
  messagingSenderId: "113106295196",
  appId: "1:113106295196:web:a648ea7aadf4a6c6bdd059"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app)

export {database};