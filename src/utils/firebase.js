// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDF1f5EeF6cIsldc6FnyspmIgFFOLojwKk",
  authDomain: "harmony-testing-c67ff.firebaseapp.com",
  databaseURL: "https://harmony-testing-c67ff-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "harmony-testing-c67ff",
  storageBucket: "harmony-testing-c67ff.appspot.com",
  messagingSenderId: "754293808870",
  appId: "1:754293808870:web:743baaddbdcdba34a4a527",
  measurementId: "G-02T4T5B4FW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { database };
