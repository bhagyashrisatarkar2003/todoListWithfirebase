// app.js
import { auth, db } from './firebaseConfig.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getIdToken
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';
import {
  collection, addDoc, doc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

// Toggle backend usage (optional)
let useBackend = false;
$('#btn-backend-toggle').addEventListener('click', () => {
  useBackend = !useBackend;
  $('#btn-backend-toggle').textContent = `Use Backend: ${useBackend ? 'On' : 'Off'}`;
});

// AUTH
$('#btn-register').addEventListener('click', async () => {
  const email = $('#email').value.trim();
  const pw = $('#password').value;
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, pw);
    $('#status').textContent = `Registered: ${userCred.user.email}`;
  } catch (e) {
    alert('Register failed: ' + e.message);
  }
});

$('#btn-login-submit').addEventListener('click', async () => {
  const email = $('#email').value.trim();
  const pw = $('#password').value;
  try {
    await signInWithEmailAndPassword(auth, email, pw);
  } catch (e) {
    alert('Login failed: ' + e.message);
  }
});

$('#btn-logout').addEventListener('click', async () => {
  await signOut(auth);
});

// when auth state changes
onAuthStateChanged(auth, async (user) => {
  if (user) {
    $('#btn-logout').classList.remove('hidden');
    $('#btn-register').classList.add('hidden');
    $('#btn-login-submit').classList.add('hidden');
    $('#auth-info').textContent = `Logged in as ${user.email}`;
    $('#status').textContent = 'Fetching shops...';
    await fetchAndRenderShops();
  } else {
    $('#btn-logout').classList.add('hidden');
    $('#btn-register').classList.remove('hidden');
    $('#btn-login-submit').classList.remove('hidden');
    $('#auth-info').textContent = 'Not logged in';
    $('#shop-list').innerHTML = '';
  }
});

// SHOPS CRUD (Firestore)
async function fetchAndRenderShops() {
  try {
    $('#shop-list').innerHTML = 'Loading...';
    if (useBackend) {
      // call backend REST endpoint (if backend running)
      const res = await fetch('/api/shops');
      const shops = await res.json();
      renderShops(shops);
    } else {
      const q = query(collection(db, 'shops'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const shops = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderShops(shops);
    }
    $('#status').textContent = 'Shops loaded';
  } catch (e) {
    console.error(e);
    $('#shop-list').innerHTML = 'Failed to load shops';
  }
}

function renderShops(shops) {
  if (!shops || shops.length === 0) {
    $('#shop-list').innerHTML = '<div class="small muted">No shops created yet.</div>';
    return;
  }
  $('#shop-list').innerHTML = shops.map(s => `
    <div class="shop-card" data-id="${s.id}">
      <div class="shop-meta">
        <strong>${escapeHtml(s.name)}</strong> <span class="badge">${escapeHtml(s.floor||'')}</span>
        <div class="small muted">${escapeHtml(s.address||'')}</div>
      </div>
      <div class="actions">
        <button data-action="offers">Offers</button>
        <button data-action="edit">Edit</button>
        <button data-action="delete">Delete</button>
      </div>
    </div>
  `).join('');

  // attach handlers
  $$('#shop-list .shop-card button').forEach(btn => {
    btn.addEventListener('click', async (ev) => {
      const card = ev.target.closest('.shop-card');
      const id = card.dataset.id;
      const action = ev.target.dataset.action;
      if (action === 'offers') openOffers(id);
      if (action === 'edit') openEditShop(id);
      if (action === 'delete') deleteShop(id);
    });
  });
}

$('#btn-refresh').addEventListener('click', fetchAndRenderShops);
$('#btn-show-all-offers').addEventListener('click', async () => {
  // fetch all offers and render in modal
  if (useBackend) {
    const res = await fetch('/api/offers');
    const offers = await res.json();
    showOffersModal('All Offers', offers);
  } else {
    const snap = await getDocs(collection(db, 'offers'));
    const offers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    showOffersModal('All Offers', offers);
  }
});

// Create shop
$('#btn-create-shop').addEventListener('click', () => {
  $('#create-shop-section').classList.toggle('hidden');
});
$('#btn-cancel-shop').addEventListener('click', () => {
  $('#create-shop-section').classList.add('hidden');
});
$('#btn-save-shop').addEventListener('click', async () => {
  const name = $('#shop-name').value.trim();
  const address = $('#shop-address').value.trim();
  const floor = $('#shop-floor').value.trim();
  if (!name) return alert('Shop name required');
  try {
    if (useBackend) {
      // send ID token for verification
      const token = await getIdToken(auth.currentUser, /* forceRefresh */ true);
      await fetch('/api/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ name, address, floor })
      });
    } else {
      await addDoc(collection(db, 'shops'), {
        name, address, floor, createdAt: Date.now(), owner: auth.currentUser ? auth.currentUser.uid : null
      });
    }
    $('#shop-name').value = $('#shop-address').value = $('#shop-floor').value = '';
    $('#create-shop-section').classList.add('hidden');
    await fetchAndRenderShops();
  } catch (e) {
    alert('Failed to create shop: ' + e.message);
  }
});

// Edit / Delete helpers
async function openEditShop(id) {
  // load doc
  if (useBackend) {
    const res = await fetch('/api/shops/' + id);
    const s = await res.json();
    $('#shop-name').value = s.name;
    $('#shop-address').value = s.address;
    $('#shop-floor').value = s.floor || '';
  } else {
    const d = await getDoc(doc(db, 'shops', id));
    const s = d.data();
    $('#shop-name').value = s.name;
    $('#shop-address').value = s.address;
    $('#shop-floor').value = s.floor || '';
  }
  $('#create-shop-section').classList.remove('hidden');
  // override save to perform update
  $('#btn-save-shop').onclick = async () => {
    const name = $('#shop-name').value.trim();
    const address = $('#shop-address').value.trim();
    const floor = $('#shop-floor').value.trim();
    if (!name) return alert('Name required');
    try {
      if (useBackend) {
        const token = await getIdToken(auth.currentUser, true);
        await fetch('/api/shops/' + id, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
          body: JSON.stringify({ name, address, floor })
        });
      } else {
        await updateDoc(doc(db, 'shops', id), { name, address, floor });
      }
      $('#create-shop-section').classList.add('hidden');
      $('#btn-save-shop').onclick = null; // restore default
      await fetchAndRenderShops();
    } catch (e) {
      alert('Update failed: ' + e.message);
    }
  };
}

async function deleteShop(id) {
  if (!confirm('Delete shop?')) return;
  try {
    if (useBackend) {
      const token = await getIdToken(auth.currentUser, true);
      await fetch('/api/shops/' + id, { method: 'DELETE', headers: { Authorization: 'Bearer ' + token }});
    } else {
      await deleteDoc(doc(db, 'shops', id));
    }
    await fetchAndRenderShops();
  } catch (e) {
    alert('Delete failed: ' + e.message);
  }
}

// OFFERS per shop
let currentShopId = null;
async function openOffers(shopId) {
  currentShopId = shopId;
  // get shop name
  if (useBackend) {
    const res = await fetch('/api/shops/' + shopId);
    const s = await res.json();
    $('#offers-shop-name').textContent = s.name;
    const offersRes = await fetch(`/api/shops/${shopId}/offers`);
    const offers = await offersRes.json();
    showOffersModal(s.name, offers);
  } else {
    const d = await getDoc(doc(db, 'shops', shopId));
    const s = d.data();
    $('#offers-shop-name').textContent = s.name;
    const q = query(collection(db, 'offers'), where('shopId', '==', shopId));
    const snap = await getDocs(q);
    const offers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    showOffersModal(s.name, offers);
  }
}

function showOffersModal(shopName, offers){
  $('#offers-modal').classList.remove('hidden');
  $('#offers-shop-name').textContent = shopName;
  const list = (offers || []).map(o => `<div class="shop-card"><div class="shop-meta"><strong>${escapeHtml(o.title)}</strong><div class="small muted">${escapeHtml(o.description || '')}</div><div class="small muted">Expiry: ${o.expiry || '—'}</div></div></div>`).join('');
  $('#offer-list').innerHTML = list || '<div class="small muted">No offers</div>';
}

$('#btn-close-offers').addEventListener('click', () => $('#offers-modal').classList.add('hidden'));
$('#btn-save-offer').addEventListener('click', async () => {
  const title = $('#offer-title').value.trim();
  const description = $('#offer-desc').value.trim();
  const expiry = $('#offer-expiry').value || null;
  if (!title) return alert('Offer title required');
  try {
    if (useBackend) {
      const token = await getIdToken(auth.currentUser, true);
      await fetch(`/api/shops/${currentShopId}/offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ title, description, expiry })
      });
    } else {
      await addDoc(collection(db, 'offers'), { title, description, expiry, shopId: currentShopId, createdAt: Date.now() });
    }
    $('#offer-title').value = $('#offer-desc').value = $('#offer-expiry').value = '';
    await openOffers(currentShopId);
  } catch (e) {
    alert('Failed to save offer: ' + e.message);
  }
});

// Utility
function escapeHtml(str = '') {
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}

// initial load
fetchAndRenderShops();
