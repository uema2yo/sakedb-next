import { SITE_URL } from "../../constants";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import type { ActionCodeSettings } from "firebase/auth";
import { auth, db } from "@lib/firebase/init";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { addDocument } from "@lib/firebase/addDocument";

export async function createUser(
	id: string,
	email: string,
	password: string
): Promise<{ status: number; body: { message: string } }> {
	const currentPath = window.location.pathname;
	const timestamp = new Date().getTime();
	try {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;
		if (user) {
			const target_page = currentPath !== "/register" ? currentPath : "/mypage";
			const actionCodeSettings: ActionCodeSettings = {
				url: SITE_URL + target_page,
				handleCodeInApp: false
			};
			await sendEmailVerification(user, actionCodeSettings);
			await setDoc(doc(db, "m_user", user.uid), {
				//uid を一致させるために m_user は setDoc を使う。
				uid: user.uid,
				timestamp: timestamp
			});
			addDocument("b_user_id", {
				uid: user.uid,
				value: id,
				public: true,
				timestamp: timestamp
			});
			addDocument("b_user_email", {
				uid: user.uid,
				value: email,
				public: false,
				timestamp: timestamp
			});
			addDocument("b_user_status", {
				uid: user.uid,
				value: 1,
				timestamp: timestamp
			});
		}
		return {
			status: 200,
			body: {
				message: "Signup successful"
			}
		};
	} catch (error: unknown) {
		if (error instanceof Error) {
			return {
				status: 500,
				body: {
					message: error.message
				}
			};
		} else {
			return {
				status: 500,
				body: {
					message: "An unknown error occurred"
				}
			};
		}
	}
}
