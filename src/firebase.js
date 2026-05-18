// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWTZCqK4SM75X8n7TohmlBWDoESiHffwI",
  authDomain: "ai-intelligence-93f5c.firebaseapp.com",
  projectId: "ai-intelligence-93f5c",
  storageBucket: "ai-intelligence-93f5c.firebasestorage.app",
  messagingSenderId: "316475921908",
  appId: "1:316475921908:web:4d0c95b9c6d925db2395a1",
  measurementId: "G-701DTCRGJ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);