// js/setupCollections.js

import { db } from './firebaseConfig.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export async function createInitialCollections() {
  try {
    // USERS (now includes password fields)
    await addDoc(collection(db, "users"), { 
      name: "Admin User", 
      email: "admin@ship.com", 
      password: "admin123",
      role: "admin" 
    });
    await addDoc(collection(db, "users"), { 
      name: "John Cook", 
      email: "cook@ship.com", 
      password: "cook123",
      role: "headcook" 
    });
    await addDoc(collection(db, "users"), { 
      name: "Ravi Supervisor", 
      email: "supervisor@ship.com", 
      password: "super123",
      role: "supervisor" 
    });
    await addDoc(collection(db, "users"), { 
      name: "Mira Voyager", 
      email: "voyager@ship.com", 
      password: "voyager123",
      role: "voyager" 
    });

    // CATERING ORDERS
    await addDoc(collection(db, "cateringOrders"), { orderId: "C001", voyagerName: "Mira", mealType: "Lunch", date: new Date().toISOString() });
    await addDoc(collection(db, "cateringOrders"), { orderId: "C002", voyagerName: "Arjun", mealType: "Dinner", date: new Date().toISOString() });
    await addDoc(collection(db, "cateringOrders"), { orderId: "C003", voyagerName: "Sana", mealType: "Breakfast", date: new Date().toISOString() });
    await addDoc(collection(db, "cateringOrders"), { orderId: "C004", voyagerName: "Ravi", mealType: "Snack", date: new Date().toISOString() });

    // STATIONERY ORDERS
    await addDoc(collection(db, "stationeryOrders"), { orderId: "S001", item: "Printer Paper", quantity: 10, supervisor: "Ravi" });
    await addDoc(collection(db, "stationeryOrders"), { orderId: "S002", item: "Pens", quantity: 20, supervisor: "Ravi" });
    await addDoc(collection(db, "stationeryOrders"), { orderId: "S003", item: "Markers", quantity: 5, supervisor: "Ravi" });

    // RESORT BOOKINGS
    await addDoc(collection(db, "resortBookings"), { bookingId: "R001", voyagerName: "Mira", resort: "Ocean Paradise", date: new Date().toISOString() });
    await addDoc(collection(db, "resortBookings"), { bookingId: "R002", voyagerName: "Karan", resort: "Sea Wave Resort", date: new Date().toISOString() });

    // SALON BOOKINGS
    await addDoc(collection(db, "salonBookings"), { bookingId: "SL001", voyagerName: "Mira", service: "Spa", date: new Date().toISOString() });
    await addDoc(collection(db, "salonBookings"), { bookingId: "SL002", voyagerName: "Priya", service: "Haircut", date: new Date().toISOString() });

    // FITNESS BOOKINGS
    await addDoc(collection(db, "fitnessBookings"), { bookingId: "F001", voyagerName: "Mira", activity: "Yoga", date: new Date().toISOString() });
    await addDoc(collection(db, "fitnessBookings"), { bookingId: "F002", voyagerName: "Arjun", activity: "Gym", date: new Date().toISOString() });

    // PARTY BOOKINGS
    await addDoc(collection(db, "partyBookings"), { bookingId: "P001", voyagerName: "Mira", event: "Birthday Party", date: new Date().toISOString() });
    await addDoc(collection(db, "partyBookings"), { bookingId: "P002", voyagerName: "Ravi", event: "Anniversary", date: new Date().toISOString() });

    // LOGS
    await addDoc(collection(db, "logs"), { action: "SYSTEM_SETUP", timestamp: new Date().toISOString() });
    await addDoc(collection(db, "logs"), { action: "ADMIN_CREATED", timestamp: new Date().toISOString() });
    await addDoc(collection(db, "logs"), { action: "SAMPLE_DATA_ADDED", timestamp: new Date().toISOString() });

    console.log("✅ All collections created with demo data including passwords!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}
