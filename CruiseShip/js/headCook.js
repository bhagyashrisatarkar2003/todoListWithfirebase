import { db } from './firebaseConfig.js';
import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { logEvent } from './logger.js';

document.getElementById("viewOrdersBtn").onclick = async () => {
  const q = query(collection(db, "cateringOrders"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map(doc => doc.data());
  document.getElementById("ordersList").innerText = JSON.stringify(data, null, 2);
  logEvent("VIEW_CATERING_ORDERS", { count: data.length });
};

document.getElementById("logoutCook").onclick = () => {
  window.location.href = "index.html";
};
