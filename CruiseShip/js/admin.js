import { db } from './firebaseConfig.js';
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { logEvent } from './logger.js';

document.getElementById('addItemBtn').onclick = async () => {
  const name = document.getElementById('itemName').value.trim();
  const price = parseFloat(document.getElementById('itemPrice').value);
  const msg = document.getElementById('itemMsg');

  try {
    await addDoc(collection(db, "cateringItems"), { name, price, createdAt: new Date() });
    msg.innerText = "✅ Item added successfully";
    logEvent("ADD_ITEM", { name, price });
  } catch (e) {
    msg.innerText = "❌ Error: " + e.message;
    logEvent("ADD_ITEM_ERROR", e.message);
  }
};

document.getElementById('loadVoyagersBtn').onclick = async () => {
  const snap = await getDocs(collection(db, "users"));
  const list = snap.docs.map(doc => doc.data());
  document.getElementById('voyagerList').innerText = JSON.stringify(list, null, 2);
  logEvent("LOAD_VOYAGERS", { count: list.length });
};

document.getElementById('logoutAdmin').onclick = () => {
  window.location.href = "index.html";
};
