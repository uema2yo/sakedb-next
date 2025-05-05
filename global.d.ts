import type { FirebaseApp } from "firebase/app";
import type { Firestore } from "firebase/firestore";
import type { Auth } from "firebase/auth";

declare global {
  var firebaseApp: FirebaseApp;
  var firebaseDb: Firestore;
  var firebaseAuth: Auth;
}

export {};
