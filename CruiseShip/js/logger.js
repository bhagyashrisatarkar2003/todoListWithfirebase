import { db } from './firebaseConfig.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export async function logEvent(action, data) {
  console.log(`[LOG] ${action}`, data);
  try {
    await addDoc(collection(db, "logs"), { action, data, createdAt: serverTimestamp() });
  } catch (e) {
    console.warn("Log error:", e);
  }
}
