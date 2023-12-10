import { initializeApp } from "firebase/app";
import {
	getAuth,
	setPersistence,
	browserLocalPersistence,
	connectAuthEmulator
} from "firebase/auth";
import {
	initializeFirestore,
	CACHE_SIZE_UNLIMITED,
	connectFirestoreEmulator
} from "firebase/firestore";

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
	authEmulatorHost: process.env.NEXT_PUBLIC_LOCAL === "TRUE" ? "localhost:9099" : ""
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence);

export const db = initializeFirestore(app, {
	cacheSizeBytes: CACHE_SIZE_UNLIMITED
});

if (process.env.NEXT_PUBLIC_LOCAL === "TRUE") {
	connectFirestoreEmulator(db, "127.0.0.1", 8080);
	connectAuthEmulator(auth, "http://localhost:9099");
}
