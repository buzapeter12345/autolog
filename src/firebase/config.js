// Firebase Production Configuration for autolog-3220a
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

// Permanently baked production config for autolog-3220a
export const firebaseConfig = {
  apiKey: 'AIzaSyB_t-h3p-thAYUg9OaudL2wLZmdqwxJHcQ',
  projectId: 'autolog-3220a',
  authDomain: 'autolog-3220a.firebaseapp.com',
  storageBucket: 'autolog-3220a.firebasestorage.app'
};

let app = null;
let db = null;
let auth = null;
let isFirebaseActive = false;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
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

// Auth Actions
export async function loginWithGoogle() {
  if (!auth) {
    throw new Error('A Firebase Auth még nincs inicializálva.');
  }
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
}

export async function loginWithEmail(email, password) {
  if (!auth) {
    throw new Error('A Firebase Auth még nincs inicializálva.');
  }
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(email, password) {
  if (!auth) {
    throw new Error('A Firebase Auth még nincs inicializálva.');
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
