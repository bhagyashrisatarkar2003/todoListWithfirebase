import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

 const firebaseConfig = {
    apiKey: "AIzaSyAxT0VD98YmywY5YnHWlAIlIoijkvpyDeg",
    authDomain: "cruiseship-578c6.firebaseapp.com",
    projectId: "cruiseship-578c6",
    storageBucket: "cruiseship-578c6.firebasestorage.app",
    messagingSenderId: "281664011035",
    appId: "1:281664011035:web:b7710a5cebbb153a72b1be",
    measurementId: "G-Z18HB03H1M"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
