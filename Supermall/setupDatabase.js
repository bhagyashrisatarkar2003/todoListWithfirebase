// setupDatabase.js
import { db } from "./firebaseConfig.js";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function setupSupermallDatabase() {
  try {
    console.log("🚀 Starting Firestore setup for SuperMall...");

    // Check if data already exists (avoid duplicates)
    const usersSnapshot = await getDocs(collection(db, "users"));
    if (!usersSnapshot.empty) {
      console.log("⚠️ Firestore already initialized — skipping setup.");
      alert("Firestore already has data! Skipping setup.");
      return;
    }

    // ----- USERS -----
    const usersRef = collection(db, "users");
    const adminRef = await addDoc(usersRef, {
      name: "Admin User",
      email: "admin@supermall.com",
      password: "admin123",
      role: "admin",
      createdAt: new Date().toISOString()
    });

    const merchantRef = await addDoc(usersRef, {
      name: "Merchant User",
      email: "merchant@supermall.com",
      password: "merchant123",
      role: "merchant",
      createdAt: new Date().toISOString()
    });

    const customerRef = await addDoc(usersRef, {
      name: "Customer User",
      email: "customer@supermall.com",
      password: "customer123",
      role: "customer",
      createdAt: new Date().toISOString()
    });

    console.log("✅ Sample users added");

    // ----- SHOPS -----
    const shopsRef = collection(db, "shops");
    const shop1 = await addDoc(shopsRef, {
      name: "Trendy Fashion",
      address: "Ground Floor, Shop 12",
      floor: "G-12",
      ownerEmail: "merchant@supermall.com",
      createdAt: new Date().toISOString()
    });
    const shop2 = await addDoc(shopsRef, {
      name: "Gadget World",
      address: "First Floor, Shop 108",
      floor: "F-108",
      ownerEmail: "merchant@supermall.com",
      createdAt: new Date().toISOString()
    });

    console.log("✅ Sample shops added");

    // ----- OFFERS -----
    const offersRef = collection(db, "offers");
    await addDoc(offersRef, {
      shopId: shop1.id,
      title: "Diwali Sale 50% Off",
      description: "Flat 50% off on all clothing",
      expiry: "2025-11-10",
      createdAt: new Date().toISOString()
    });
    await addDoc(offersRef, {
      shopId: shop2.id,
      title: "Gadget Bonanza",
      description: "Buy 1 Get 1 on Accessories",
      expiry: "2025-11-15",
      createdAt: new Date().toISOString()
    });

    console.log("✅ Sample offers added");

    console.log("🎉 Firestore setup completed successfully!");
    alert("✅ Firestore setup completed successfully! Check your Firebase console.");
  } catch (error) {
    console.error("❌ Firestore setup failed:", error);
    alert("❌ Error: " + error.message);
  }
}

setupSupermallDatabase();
