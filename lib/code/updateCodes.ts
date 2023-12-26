import {
	collection,
	writeBatch,
	doc,
	getDocs,
	CollectionReference,
	DocumentReference,
	query,
	where,
	QuerySnapshot
} from "firebase/firestore";
import { db } from "@lib/firebase/init";
import type { DocumentData } from "firebase/firestore";

export async function updateCodes(
	collectionName: string,
	codes: { code: number | string; label: string }[]
) {
	const batch = writeBatch(db);
	const collectionRef: CollectionReference<DocumentData> = collection(db, collectionName);

	for (const code of codes) {
		if (code.code) {
			const queryRef = query(collectionRef, where("code", "==", code.code));
			const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(queryRef);

			if (!querySnapshot.empty) {
				const docRef: DocumentReference<DocumentData> = querySnapshot.docs[0].ref;
				batch.update(docRef, code);
			} else {
				const docRef: DocumentReference<DocumentData> = doc(collectionRef);
				batch.set(docRef, code);
			}
		}
	}
	await batch.commit();
}
