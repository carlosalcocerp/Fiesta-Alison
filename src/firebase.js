// ─────────────────────────────────────────────────────────
// 🔥 Firebase Configuration & Initialization
// Fiesta de Cumpleaños de Alisson 🎸🎂
// ─────────────────────────────────────────────────────────

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAYgllJETqSB5syap984t89JAjlfQ6NIKw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "fiesta-alison.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "fiesta-alison",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "fiesta-alison.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "712269167819",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:712269167819:web:51d17a6d4282664fde6f4e",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-81CRKBTSVZ"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, db, storage };
