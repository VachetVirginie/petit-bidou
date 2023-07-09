import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseApp = initializeApp({
  apiKey: "AIzaSyDu2okLVWSgZKc8ZLXh41A73ghKzmE4ak4",
  authDomain: "petit-bidou.firebaseapp.com",
  projectId: "petit-bidou",
  storageBucket: "petit-bidou.appspot.com",
  messagingSenderId: "691085757392",
  appId: "1:691085757392:web:71d8f7f3ddca8156b687d5",
  measurementId: "G-CY5ZLFP5N9",
});

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
