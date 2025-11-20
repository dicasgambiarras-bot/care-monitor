import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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