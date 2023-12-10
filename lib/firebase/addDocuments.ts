import { collection, writeBatch, doc } from "firebase/firestore";
import { db } from "@lib/firebase/init";

export async function addDocuments(
	collectionName: string,
	documents: { name: string; value: string | number | boolean }[]
) {
	const batch = writeBatch(db);
	const collectionRef = collection(db, collectionName);
	documents.forEach((document) => {
		const docRef = doc(collectionRef);
		batch.set(docRef, document, {merge: true});
	});
  await batch.commit();
}
