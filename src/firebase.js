// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_G7yD1P8p99n1PGAzk6hwGwdC1E61X-w",
  authDomain: "sample-firebase-ai-app-1b199.firebaseapp.com",
  projectId: "sample-firebase-ai-app-1b199",
  storageBucket: "sample-firebase-ai-app-1b199.appspot.com",
  messagingSenderId: "986541864092",
  appId: "1:986541864092:web:61bf4612787ab0dde8a959"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
