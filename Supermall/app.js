// app.js

import { auth, db } from './firebaseConfig.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import {
  collection, addDoc, getDocs
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const authInfo = document.getElementById('auth-info');
const shopSection = document.getElementById('shop-section');
const shopList = document.getElementById('shop-list');

// ---------- AUTH ----------
document.getElementById('btn-register').onclick = async () => {
  try {
    await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    authInfo.textContent = "✅ Registered successfully!";
  } catch (e) {
    authInfo.textContent = "❌ " + e.message;
  }
};

document.getElementById('btn-login-submit').onclick = async () => {
  try {
    await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    authInfo.textContent = "✅ Logged in!";
  } catch (e) {
    authInfo.textContent = "❌ " + e.message;
  }
};

document.getElementById('btn-logout').onclick = async () => {
  await signOut(auth);
};

// ---------- AUTH STATE ----------
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById('auth-section').classList.add('hidden');
    shopSection.classList.remove('hidden');
    document.getElementById('btn-login').classList.add('hidden');
    document.getElementById('btn-logout').classList.remove('hidden');
    loadShops();
  } else {
    document.getElementById('auth-section').classList.remove('hidden');
    shopSection.classList.add('hidden');
    document.getElementById('btn-login').classList.remove('hidden');
    document.getElementById('btn-logout').classList.add('hidden');
  }
});

// ---------- FIRESTORE ----------
async function loadShops() {
  shopList.innerHTML = "Loading...";
  const snapshot = await getDocs(collection(db, "shops"));
  let html = "";
  snapshot.forEach(doc => {
    const s = doc.data();
    html += `<div class='card'><b>${s.name}</b><br>${s.address} (${s.floor || 'N/A'})</div>`;
  });
  shopList.innerHTML = html || "No shops yet.";
}

document.getElementById('btn-save-shop').onclick = async () => {
  const name = document.getElementById('shop-name').value.trim();
  const address = document.getElementById('shop-address').value.trim();
  const floor = document.getElementById('shop-floor').value.trim();
  if (!name || !address) {
    alert("Please fill shop name and address");
    return;
  }
  await addDoc(collection(db, "shops"), { name, address, floor });
  alert("✅ Shop saved!");
  document.getElementById('shop-name').value = '';
  document.getElementById('shop-address').value = '';
  document.getElementById('shop-floor').value = '';
  loadShops();
};

document.getElementById('btn-refresh').onclick = loadShops;
