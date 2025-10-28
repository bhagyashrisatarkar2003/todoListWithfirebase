// firebaseConfig.js
// IMPORTANT: replace placeholders with your Firebase project config
// and then import in app.js via: import { app, auth, db } from './firebaseConfig.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
