  import { initializeApp } from "firebase/app";
  import {getAuth,GoogleAuthProvider} from "firebase/auth";
  const firebaseConfig = {
    apiKey: "AIzaSyDM1CbOilVvk4ZX9TzyVp8AwmDzv-xpEzM",
    authDomain: "rec-hackathon.firebaseapp.com",
    projectId: "rec-hackathon",
    storageBucket: "rec-hackathon.appspot.com",
    messagingSenderId: "150710317758",
    appId: "1:150710317758:web:cb50dd90d440775236e4ef",
    measurementId: "G-8QM5V9GK6P"
  };
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)
  const provider = new GoogleAuthProvider();
  export {auth,provider};
