// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDhCALq4dNYws5ZmRgX7LcUNiuSCL78vcU",
  authDomain: "supermall-c2673.firebaseapp.com",
  projectId: "supermall-c2673",
  storageBucket: "supermall-c2673.appspot.com",
  messagingSenderId: "493135945215",
  appId: "1:493135945215:web:763b2548b02b000ccd9bca",
  measurementId: "G-N0GCT2C5QX"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
