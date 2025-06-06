
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDB5qMjJOZx7Wzy6_vjaU68BpL4SOqm6DA",
  authDomain: "a1ca-4fb43.firebaseapp.com",
  projectId: "a1ca-4fb43",
  storageBucket: "a1ca-4fb43.firebasestorage.app",
  messagingSenderId: "815967643612",
  appId: "1:815967643612:web:02fe7c2158eaac4a2a1119",
  measurementId: "G-Z8TBQQCRXL"
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
const firestore: Firestore = getFirestore(app);
let analytics: Analytics | undefined;

if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, firestore, analytics };
