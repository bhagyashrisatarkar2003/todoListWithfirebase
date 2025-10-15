import { db } from './firebaseConfig.js';
import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { logEvent } from './logger.js';

async function saveOrder(col, data, msgEl) {
  try {
    await addDoc(collection(db, col), { ...data, createdAt: serverTimestamp() });
    msgEl.innerText = "✅ Successfully placed!";
    logEvent(col, data);
  } catch (e) {
    msgEl.innerText = "❌ Error: " + e.message;
    logEvent("ERROR_" + col, e.message);
  }
}

document.getElementById("orderCateringBtn").onclick = () =>
  saveOrder("cateringOrders", {
    item: document.getElementById("c_item").value,
    qty: document.getElementById("c_qty").value
  }, document.getElementById("cateringMsg"));

document.getElementById("orderStationeryBtn").onclick = () =>
  saveOrder("stationeryOrders", {
    item: document.getElementById("s_item").value,
    qty: document.getElementById("s_qty").value
  }, document.getElementById("stationeryMsg"));

document.getElementById("bookResortBtn").onclick = () =>
  saveOrder("resortBookings", {
    type: document.getElementById("resortType").value,
    date: document.getElementById("resortDate").value
  }, document.getElementById("resortMsg"));

document.getElementById("bookSalonBtn").onclick = () =>
  saveOrder("salonBookings", {
    date: document.getElementById("salonDate").value
  }, document.getElementById("salonMsg"));

document.getElementById("bookFitnessBtn").onclick = () =>
  saveOrder("fitnessBookings", {
    date: document.getElementById("fitnessDate").value,
    equipment: document.getElementById("equipmentSelect").value
  }, document.getElementById("fitnessMsg"));

document.getElementById("bookPartyBtn").onclick = () =>
  saveOrder("partyBookings", {
    type: document.getElementById("partyType").value,
    date: document.getElementById("partyDate").value
  }, document.getElementById("partyMsg"));
