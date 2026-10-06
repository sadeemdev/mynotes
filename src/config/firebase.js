import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { initializeFirestore, getFirestore, setLogLevel } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBdsqflxwSGst4yW3UsRE5p_bJbNe0QpNw",
  authDomain: "fitpluse-7cde0.firebaseapp.com",
  projectId: "fitpluse-7cde0", // Firebase ka purana naam hai, isko mat badlein
  storageBucket: "fitpluse-7cde0.firebasestorage.app",
  messagingSenderId: "424846927538",
  appId: "1:424846927538:web:e53cc6244e3434f1ce0bab",
  measurementId: "G-Z0YCVFR0CP"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch (error) {
  auth = getAuth(app);
}

// TEMPORARY: detailed Firestore logs in the terminal (remove after debugging)
setLogLevel("debug");

// React Native mein normal connection aksar atak jati hai, isliye long polling
let db;
try {
  db = initializeFirestore(app, { experimentalForceLongPolling: true });
} catch (error) {
  db = getFirestore(app); // already initialized (hot reload)
}

export { auth, db };