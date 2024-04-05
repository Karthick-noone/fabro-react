import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAKaUVRSlaoUDRN5ulk-BR0pLHNZLGqT04",
  authDomain: "verification-61a40.firebaseapp.com",
  projectId: "verification-61a40",
  storageBucket: "verification-61a40.appspot.com",
  messagingSenderId: "432502826871",
  appId: "1:432502826871:web:aedc0de4ecc7834dafe372",
  measurementId: "G-58NPM4HQKQ"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const firebaseExports = { auth }; // Assign the object to a variable

export default firebaseExports; // Export the variable as default