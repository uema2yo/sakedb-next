import { db } from "@/lib/firebase/init";
import { doc, updateDoc } from "firebase/firestore";
import { checkLogin, loginInfo } from "@/lib/checkLogin";

export async function updateDocument(
  collectionName: string,
  documentId: string,
  //updateData: { status: string, updatedAt: Date }
  updateData: { [key: string]: string | number |boolean }
) {
  await fetch("/api/updateDocument", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      collectionName: collectionName,
      documentId: documentId,
      updateData: updateData
    }),
  });
/*
  try {
    await checkLogin();
    const uid = loginInfo.uid;
    const documentRef = doc(db, collection_name, documentId);
    const timestamp = new Date().getTime();
    const updatedDocument = {
      ...document,
      timestamp: timestamp,
      uid: uid
    };
    await updateDoc(documentRef, updatedDocument);
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
  }*/
}
