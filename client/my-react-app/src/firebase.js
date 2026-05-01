
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "recipenest-6aa2b.firebaseapp.com",
  projectId: "recipenest-6aa2b",
  storageBucket: "recipenest-6aa2b.firebasestorage.app",
  messagingSenderId: "823389931090",
  appId: "1:823389931090:web:2ab1f5b06f7db337d1418b",
  measurementId: "G-EE57E3Z9Q2"
};

export const app = initializeApp(firebaseConfig);

