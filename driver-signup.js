// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8kJ0q0TNa-LwtpkUawdhQ1RxkBsdCeEI",
  authDomain: "louise-transport-668ba.firebaseapp.com",
  projectId: "louise-transport-668ba",
  storageBucket: "louise-transport-668ba.firebasestorage.app",
  messagingSenderId: "1017349797885",
  appId: "1:1017349797885:web:2df6d87175e9b7acb68b94",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

console.log("Firebase connected successfully!");
