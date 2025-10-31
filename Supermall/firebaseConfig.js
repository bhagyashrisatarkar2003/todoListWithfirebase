// Import Firebase SDKs (modular)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js';

// ✅ Your Supermall Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhCALq4dNYws5ZmRgX7LcUNiuSCL78vcU",
  authDomain: "supermall-c2673.firebaseapp.com",
  projectId: "supermall-c2673",
  storageBucket: "supermall-c2673.appspot.com", // ✅ corrected line
  messagingSenderId: "493135945215",
  appId: "1:493135945215:web:763b2548b02b000ccd9bca",
  measurementId: "G-N0GCT2C5QX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
