import { initializeApp, getApps, getApp } from "firebase/app";
//import type { Firestore } from "firebase-admin/firestore";
import type { Firestore } from "firebase/firestore";
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  connectAuthEmulator,
} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  databaseURL?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  measurementId?: string;
  authEmulatorHost?: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  authEmulatorHost:
    process.env.NEXT_PUBLIC_LOCAL === "TRUE" ? "localhost:9099" : "",
};

let app: FirebaseApp, db: Firestore, auth: Auth;

if (!globalThis.firebaseApp) {
	app = getApps().length ? getApp() : initializeApp(firebaseConfig);
	db = getFirestore(app);
	auth = getAuth(app);
	if (process.env.NEXT_PUBLIC_LOCAL === "TRUE") {
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
    connectAuthEmulator(auth, "http://localhost:9099");
	}
	globalThis.firebaseApp = app;
  globalThis.firebaseDb = db;
  globalThis.firebaseAuth = auth;
} else {
  app = globalThis.firebaseApp;
  db = globalThis.firebaseDb;
  auth = globalThis.firebaseAuth;	
}

/*
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
console.log("[init] Firebase App initialized");
const db = getFirestore(app);
console.log("[init] Firestore initialized");
const auth = getAuth(app);
*/
//setPersistence(auth, browserLocalPersistence);
/*
if (process.env.NEXT_PUBLIC_LOCAL === "TRUE") {
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectAuthEmulator(auth, "http://localhost:9099");
}*/

export { app, db, auth };
