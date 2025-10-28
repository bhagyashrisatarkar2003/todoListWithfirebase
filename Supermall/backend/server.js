// server.js
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const fs = require('fs');

const app = express();
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// Initialize Firebase Admin with service account JSON
// Place your service account JSON at backend/serviceAccountKey.json
const serviceAccountPath = './serviceAccountKey.json';
if (!fs.existsSync(serviceAccountPath)) {
  console.warn('No service account found at', serviceAccountPath, '- some endpoints will fail. See README.');
} else {
  admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath))
  });
}

// Simple IP blocklist (demo)
const BLOCKED = new Set([]); // add IP strings to block

app.use((req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  if (BLOCKED.has(ip)) return res.status(403).json({ error: 'forbidden' });
  next();
});

// Middleware to verify Firebase ID token (if provided)
async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = decoded;
    next();
  } catch (e) {
    console.error('Token verify failed', e.message);
    return res.status(401).json({ error: 'invalid token' });
  }
}

// Simple example: proxy Firestore operations server-side (requires admin init)
app.get('/api/shops', verifyToken, async (req, res) => {
  if (!admin.apps.length) return res.status(500).json({error:'admin-not-init'});
  const db = admin.firestore();
  const snap = await db.collection('shops').orderBy('createdAt', 'desc').get();
  const shops = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  res.json(shops);
});

app.post('/api/shops', verifyToken, async (req, res) => {
  if (!admin.apps.length) return res.status(500).json({error:'admin-not-init'});
  if (!req.user) return res.status(401).json({error:'auth-required'});
  const { name, address, floor } = req.body;
  // basic server-side sanitization
  const sanitized = {
    name: String(name || '').slice(0, 200),
    address: String(address || '').slice(0, 500),
    floor: String(floor || '').slice(0, 50),
    owner: req.user.uid,
    createdAt: Date.now()
  };
  const db = admin.firestore();
  const docRef = await db.collection('shops').add(sanitized);
  res.json({ id: docRef.id, ...sanitized });
});

// additional endpoints: get shop, update, delete; offers endpoints
app.get('/api/shops/:id', verifyToken, async (req, res) => {
  if (!admin.apps.length) return res.status(500).json({error:'admin-not-init'});
  const db = admin.firestore();
  const d = await db.collection('shops').doc(req.params.id).get();
  if (!d.exists) return res.status(404).json({error:'not-found'});
  res.json({ id: d.id, ...d.data() });
});

app.put('/api/shops/:id', verifyToken, async (req, res) => {
  if (!admin.apps.length) return res.status(500).json({error:'admin-not-init'});
  if (!req.user) return res.status(401).json({error:'auth-required'});
  const db = admin.firestore();
  // server-side check: only owner can update (simple)
  const docRef = db.collection('shops').doc(req.params.id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) return res.status(404).json({error:'not-found'});
  const data = docSnap.data();
  if (data.owner !== req.user.uid) return res.status(403).json({error:'forbidden'});
  await docRef.update({
    name: String(req.body.name || data.name),
    address: String(req.body.address || data.address),
    floor: String(req.body.floor || data.floor)
  });
  res.json({ ok: true });
});

app.delete('/api/shops/:id', verifyToken, async (req, res) => {
  if (!admin.apps.length) return res.status(500).json({error:'admin-not-init'});
  if (!req.user) return res.status(401).json({error:'auth-required'});
  const db = admin.firestore();
  const docRef = db.collection('shops').doc(req.params.id);
  const docSnap = await docRef.get();
  if (!docSnap.exists) return res.status(404).json({error:'not-found'});
  const data = docSnap.data();
  if (data.owner !== req.user.uid) return res.status(403).json({error:'forbidden'});
  await docRef.delete();
  res.json({ ok: true });
});

// Offer endpoints
app.get('/api/shops/:id/offers', verifyToken, async (req, res) => {
  if (!admin.apps.length) return res.status(500).json({error:'admin-not-init'});
  const db = admin.firestore();
  const snap = await db.collection('offers').where('shopId', '==', req.params.id).get();
  const offers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  res.json(offers);
});

app.post('/api/shops/:id/offers', verifyToken, async (req, res) => {
  if (!admin.apps.length) return res.status(500).json({error:'admin-not-init'});
  if (!req.user) return res.status(401).json({error:'auth-required'});
  const { title, description, expiry } = req.body;
  const sanitized = {
    title: String(title || '').slice(0, 200),
    description: String(description || '').slice(0, 1000),
    expiry: expiry || null,
    shopId: req.params.id,
    createdAt: Date.now()
  };
  const db = admin.firestore();
  const docRef = await db.collection('offers').add(sanitized);
  res.json({ id: docRef.id, ...sanitized });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Backend listening on', port));
