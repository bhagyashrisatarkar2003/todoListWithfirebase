import { db } from './firebaseConfig.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export async function logEvent(action, actor) {
  try {
    await addDoc(collection(db, "logs"), {
      action,
      actor,
      timestamp: new Date().toISOString()
    });
    console.log(`📘 LOGGED: ${action} by ${actor}`);
  } catch (err) {
    console.error("❌ Logging error:", err.message);
  }
}
