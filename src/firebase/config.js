// Firebase Production Initialization Module
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

// Read config from LocalStorage if previously entered or fallback to production
export function getFirebaseConfig() {
  try {
    const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (stored) {
      const cfg = JSON.parse(stored);
      if (cfg.apiKey && cfg.projectId) {
        if (!cfg.authDomain) cfg.authDomain = `${cfg.projectId}.firebaseapp.com`;
        if (!cfg.storageBucket) cfg.storageBucket = `${cfg.projectId}.firebasestorage.app`;
        return cfg;
      }
    }
  } catch (e) {
    console.error('Firebase config read error', e);
  }
  
  // Default fallback if stored key exists
  return null;
}

let app = null;
let db = null;
let auth = null;
let isFirebaseActive = false;

const userConfig = getFirebaseConfig();

if (userConfig && userConfig.apiKey && userConfig.projectId) {
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
    throw new Error('A Firebase még nincs csatlakoztatva.');
  }
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
}

export async function loginWithEmail(email, password) {
  if (!isFirebaseActive || !auth) {
    throw new Error('A Firebase még nincs csatlakoztatva.');
  }
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(email, password) {
  if (!isFirebaseActive || !auth) {
    throw new Error('A Firebase még nincs csatlakoztatva.');
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
