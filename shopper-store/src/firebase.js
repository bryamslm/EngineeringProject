// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, addDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBbQKdJMBHckX2lWSKTR7lU9wDJYKRQUQI",
  authDomain: "veroshopper-cbeb1.firebaseapp.com",
  projectId: "veroshopper-cbeb1",
  storageBucket: "veroshopper-cbeb1.appspot.com",
  messagingSenderId: "1055503157847",
  appId: "1:1055503157847:web:76aec16ae376c9f3333112",
  measurementId: "G-GPB84QJMTF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
const analytics = getAnalytics(app);
export const storage = getStorage();
export const auth = getAuth(app);
 
//Firebase Cruds
export const addDocument = async (ref, data) => {
  try {
    const docRef = await addDoc(ref, data);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
