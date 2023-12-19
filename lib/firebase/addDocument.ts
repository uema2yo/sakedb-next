import { db } from "@lib/firebase/init";
import { collection, addDoc } from "firebase/firestore";
import { checkLogin, loginInfo } from "@lib/checkLogin";

export async function addDocument(
	collectionName: string,
	document: Record<string, unknown>
) {
	try {
		await checkLogin();
		const uid = loginInfo.uid;
		const timestamp = new Date().getTime();
		document["timestamp"] = timestamp;
		document["uid"] = uid;
		await addDoc(collection(db, collectionName), document);
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
