import { db } from './firebaseConfig.js';
import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { logEvent } from './logger.js';

document.getElementById("viewStationeryBtn").onclick = async () => {
  const q = query(collection(db, "stationeryOrders"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map(doc => doc.data());
  document.getElementById("stationeryList").innerText = JSON.stringify(data, null, 2);
  logEvent("VIEW_STATIONERY_ORDERS", { count: data.length });
};

document.getElementById("logoutSup").onclick = () => {
  window.location.href = "index.html";
};
