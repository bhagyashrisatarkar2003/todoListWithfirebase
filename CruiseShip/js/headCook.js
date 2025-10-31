import { db } from './firebaseConfig.js';
import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { logEvent } from './logger.js';

// Fetch catering orders
async function showCateringOrders() {
  const container = document.getElementById("ordersList");
  container.innerHTML = "<p>Loading...</p>";

  try {
    const q = query(collection(db, "cateringOrders"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      container.innerHTML = "<p>No orders found.</p>";
      return;
    }

    container.innerHTML = ""; // Clear old content
    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement("div");
      div.className = "order-card";
      div.innerHTML = `
        <p class="order-item">🍽️ Item: ${data.item || 'N/A'}</p>
        <p class="order-qty">Qty: ${data.qty || 'N/A'}</p>
        <p><small>Time: ${data.createdAt?.toDate ? data.createdAt.toDate().toLocaleString() : 'Pending...'}</small></p>
      `;
      container.appendChild(div);
    });

    logEvent("VIEW_CATERING_ORDERS", `Displayed ${snapshot.size} orders`);
  } catch (error) {
    container.innerHTML = `<p style="color:red;">❌ Error: ${error.message}</p>`;
    logEvent("ERROR_VIEW_CATERING_ORDERS", error.message);
  }
}

document.addEventListener("DOMContentLoaded", showCateringOrders);
