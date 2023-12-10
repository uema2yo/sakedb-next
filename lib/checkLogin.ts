import { auth, db } from "@lib/firebase/init";
import { onAuthStateChanged } from "firebase/auth";
import type { Unsubscribe } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const login: { uid: string; user: boolean; admin: boolean; status: number } = {
	uid: "",
	user: false,
	admin: false,
	status: 0
};

export function checkLogin(): Promise<void> {
	return new Promise((resolve, reject) => {
		if (typeof window === "undefined") {
			reject(new Error("window is undefined"));
			return;
		}
		const unsubscribe: Unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			try {
				if (firebaseUser) {
					const userDoc = doc(db, "m_user", firebaseUser.uid);
					const userSnap = await getDoc(userDoc);
					const userExists = userSnap.exists();
					login.uid = firebaseUser.uid;
					login.user = userExists;
					login.admin = userExists && Boolean(userSnap.data()?.admin);
				}
			} catch (error) {
				reject(error);
			} finally {
				unsubscribe();
			}
			resolve();
		});
	});
}
