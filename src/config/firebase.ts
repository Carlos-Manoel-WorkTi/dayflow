// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKm-sknL7FjPzjfde7eYSXuvSJ-OwZzcg",
  authDomain: "dayflow-32453.firebaseapp.com",
  projectId: "dayflow-32453",
  storageBucket: "dayflow-32453.firebasestorage.app",
  messagingSenderId: "428121632392",
  appId: "1:428121632392:web:e7e563c85e0dfff463793d",
  measurementId: "G-RJRYHN1PPX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);

export const loginTestUser = async () => {
  await signInWithEmailAndPassword(auth, "carlosprogramacao6@gmail.com", "carlos");
};
// Exporta Firestore
export const db = getFirestore(app);