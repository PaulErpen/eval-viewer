import { FirebaseApp, initializeApp } from "firebase/app";

export const initializeFirebase: () => FirebaseApp = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyABN5qes2yI80oWC-RbxnEJtwTZJAtqr4w",
    authDomain: "gs-on-a-budget.firebaseapp.com",
    projectId: "gs-on-a-budget",
    storageBucket: "gs-on-a-budget.firebasestorage.app",
    messagingSenderId: "470633498207",
    appId: "1:470633498207:web:93c3e92a5a6e077fa1bdea",
  };

  return initializeApp(firebaseConfig);
};
