// security.js

import { auth, db } from './firebaseConfig.js';
import {
  doc,
  getDoc,
  setDoc
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

export const ROLES = {
  ADMIN: 'admin',
  MERCHANT: 'merchant',
  CUSTOMER: 'customer'
};

export async function assignUserRole(uid, role = ROLES.CUSTOMER) {
  try {
    await setDoc(doc(db, 'roles', uid), { role }, { merge: true });
    console.log(`Role '${role}' assigned to user: ${uid}`);
  } catch (err) {
    console.error('Error assigning role:', err.message);
  }
}

export async function getUserRole(uid) {
  try {
    const docRef = doc(db, 'roles', uid);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data().role;
    } else {
      return null;
    }
  } catch (err) {
    console.error('Error fetching role:', err.message);
    return null;
  }
}

export async function hasRole(uid, requiredRole) {
  const role = await getUserRole(uid);
  return role === requiredRole;
}

export async function handleUserAccess(user) {
  if (!user) return;

  const role = await getUserRole(user.uid);
  console.log(`Logged in as: ${user.email} | Role: ${role || 'none'}`);

  const shopSection = document.getElementById('shop-section');
  if (role === ROLES.ADMIN || role === ROLES.MERCHANT) {
    shopSection.classList.remove('hidden');
  } else {
    shopSection.classList.add('hidden');
  }
}
