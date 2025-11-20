import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged 
} from "firebase/auth";
export { setDoc, doc } from "firebase/firestore";
export type { User } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAFej_A0sFo1F1-s9O-0MEJOdH-MviKi_U",
  authDomain: "monitorai-health.firebaseapp.com",
  projectId: "monitorai-health",
  storageBucket: "monitorai-health.firebasestorage.app",
  messagingSenderId: "858869996878",
  appId: "1:858869996878:web:37a3fa59265b469b98521f",
  measurementId: "G-3NCHG5PCQ1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// If running in development and the emulator is available, connect to it.
// You can force emulator usage by setting VITE_USE_FIREBASE_EMULATOR=true in your .env
const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const useEmulator = (import.meta.env && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') || isLocalhost;

if (useEmulator) {
  try {
    // Auth emulator runs by default on 9099
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  } catch (e) {
    // ignore if emulator not available
  }
  try {
    // Firestore emulator default port 8080
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
  } catch (e) {
    // ignore
  }
}