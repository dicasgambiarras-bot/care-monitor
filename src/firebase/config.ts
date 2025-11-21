import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { 
  getFirestore, 
  connectFirestoreEmulator, 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  onSnapshot, 
  query, 
  orderBy,
  where,    // Adicionado
  getDocs   // Adicionado
} from "firebase/firestore";

export type { User } from "firebase/auth";

// Exportando as funções para usar no App.tsx
export { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged,
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  where,    // Exportando
  getDocs   // Exportando
};

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

// Lógica do Emulador vs Produção
const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Correção do erro de TS aqui usando casting 'as any'
const useEmulator = ((import.meta as any).env && (import.meta as any).env.VITE_USE_FIREBASE_EMULATOR === 'true') || isLocalhost;

if (useEmulator) {
  try {
    // connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    // connectFirestoreEmulator(db, '127.0.0.1', 8080);
    console.log("Modo emulador/local configurado.");
  } catch (e) {
    console.error("Erro ao conectar emulador", e);
  }
}