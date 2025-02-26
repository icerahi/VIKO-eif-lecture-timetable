// firebaseConfig.js
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue,
  query,
  orderByChild,
  limitToLast,
} from "firebase/database";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRYVIHl_orktaBMwsmlQtMcOaeGO0FTQI",
  authDomain: "eif-courses.firebaseapp.com",
  databaseURL: "https://eif-courses.firebaseio.com",
  projectId: "eif-courses",
  storageBucket: "eif-courses.appspot.com",
  messagingSenderId: "535363326769",
  appId: "1:535363326769:web:cc13dce33cff5884925610",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, onValue, query, orderByChild, limitToLast };
