// Firebase Production Configuration Module
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

const CONFIG_STORAGE_KEY = 'autolog_firebase_config_v1';

export function getStoredFirebaseConfig() {
  try {
    const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Firebase config read error', e);
  }
  return null;
}

export function setFirebaseApiKey(apiKey, projectId = 'autolog-3220a') {
  try {
    const config = {
      apiKey: apiKey.trim(),
      projectId: projectId.trim(),
      authDomain: `${projectId.trim()}.firebaseapp.com`,
      storageBucket: `${projectId.trim()}.firebasestorage.app`
    };
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    window.location.reload();
  } catch (e) {
    console.error('Firebase config save error', e);
  }
}

let app = null;
let db = null;
let auth = null;
let isFirebaseActive = false;

const userConfig = getStoredFirebaseConfig();

if (userConfig && userConfig.apiKey) {
  try {
    if (!getApps().length) {
      app = initializeApp(userConfig);
    } else {
      app = getApps()[0];
    }
    db = getFirestore(app);
    auth = getAuth(app);
    isFirebaseActive = true;
  } catch (err) {
    console.error('Failed to initialize Firebase:', err);
    isFirebaseActive = false;
  }
}

// Auth Actions
export async function loginWithGoogle() {
  if (!isFirebaseActive || !auth) {
    throw new Error('A Firebase API kulcs hiányzik. Kérjük adja meg az API Key-t!');
  }
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
}

export async function loginWithEmail(email, password) {
  if (!isFirebaseActive || !auth) {
    throw new Error('A Firebase API kulcs hiányzik. Kérjük adja meg az API Key-t!');
  }
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(email, password) {
  if (!isFirebaseActive || !auth) {
    throw new Error('A Firebase API kulcs hiányzik. Kérjük adja meg az API Key-t!');
  }
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function logoutUser() {
  if (auth) {
    return await signOut(auth);
  }
}

export function subscribeAuth(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export { app, db, auth, isFirebaseActive };
