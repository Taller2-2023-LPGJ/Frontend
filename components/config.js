import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-16ca90IQIMA336nKUhTeaCTb3kV4-es",
  authDomain: "snapmsg-399802.firebaseapp.com",
  projectId: "snapmsg-399802",
  storageBucket: "snapmsg-399802.appspot.com",
  messagingSenderId: "463820808275",
  appId: "1:463820808275:web:f04bbbcadcb31355ea26a6",
};

//if (!firebase.apps.length) {
const app = firebase.initializeApp(firebaseConfig);
//}

const db = getDatabase(app);

export { firebase, db };
