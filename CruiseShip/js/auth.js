// js/auth.js
import { db } from './firebaseConfig.js';
import { collection, query, where, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { logEvent } from './logger.js';

const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');

// --- Toggle Login/Register ---
if (showRegister) {
  showRegister.onclick = () => {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('register-section').style.display = 'block';
  };
}
if (showLogin) {
  showLogin.onclick = () => {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('register-section').style.display = 'none';
  };
}

// --- LOGIN FLOW ---
if (loginBtn) {
  loginBtn.onclick = async () => {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
      const q = query(collection(db, "users"), where("email", "==", email), where("password", "==", password));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        document.getElementById('loginMsg').innerText = "❌ Invalid email or password.";
        logEvent("LOGIN_ERROR", email);
        return;
      }

      const user = snapshot.docs[0].data();
      logEvent("LOGIN_SUCCESS", user.email);

      // Redirect based on role
      switch (user.role.toLowerCase()) {
        case "admin":
          window.location.href = "admin.html";
          break;
        case "headcook":
          window.location.href = "headcook.html";
          break;
        case "supervisor":
          window.location.href = "supervisor.html";
          break;
        case "voyager":
          window.location.href = "voyager.html";
          break;
        default:
          window.location.href = "dashboard.html";
      }
    } catch (e) {
      document.getElementById('loginMsg').innerText = e.message;
      logEvent("LOGIN_ERROR", e.message);
    }
  };
}

// --- REGISTER FLOW ---
if (registerBtn) {
  registerBtn.onclick = async () => {
    const name = document.getElementById('r_name').value.trim();
    const email = document.getElementById('r_email').value.trim();
    const password = document.getElementById('r_password').value.trim();

    try {
      await addDoc(collection(db, "users"), {
        name,
        email,
        password,
        role: "voyager",
        createdAt: new Date().toISOString()
      });

      logEvent("REGISTER_SUCCESS", email);
      document.getElementById('registerMsg').innerText = "✅ Registered successfully! You can now log in.";
    } catch (e) {
      document.getElementById('registerMsg').innerText = e.message;
      logEvent("REGISTER_ERROR", e.message);
    }
  };
}

// --- LOGOUT UTILITY ---
export function logout() {
  logEvent("LOGOUT", {});
  window.location.href = "index.html";
}
