// ─────────────────────────────────────────────────────────
// 🔥 Firebase Configuration & Initialization
// Fiesta de Cumpleaños de Alison 🎸🎂
// ─────────────────────────────────────────────────────────

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAYgllJETqSB5syap984t89JAjlfQ6NIKw",
  authDomain: "fiesta-alison.firebaseapp.com",
  projectId: "fiesta-alison",
  storageBucket: "fiesta-alison.firebasestorage.app",
  messagingSenderId: "712269167819",
  appId: "1:712269167819:web:51d17a6d4282664fde6f4e",
  measurementId: "G-81CRKBTSVZ"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, db, storage };
