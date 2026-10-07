import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { initializeFirestore, getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCP7MHGiuqVggZLA4MT8vsxAjx_HltL8H8",
  authDomain: "fitpluse-483a7.firebaseapp.com",
  projectId: "fitpluse-483a7",
  storageBucket: "fitpluse-483a7.firebasestorage.app",
  messagingSenderId: "310599681334",
  appId: "1:310599681334:web:5bad79713958e1bb671f97",
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

// React Native mein normal connection aksar atak jati hai, isliye long polling
let db;
try {
  db = initializeFirestore(app, { experimentalForceLongPolling: true });
} catch (error) {
  db = getFirestore(app); // already initialized (hot reload)
}

export { auth, db };