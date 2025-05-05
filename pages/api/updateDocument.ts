import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebase/admin";
import admin from "firebase-admin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  let decodedToken: admin.auth.DecodedIdToken;
  try {
    decodedToken = await admin.auth().verifyIdToken(token);
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  const authUid = decodedToken.uid;
  const { collectionName, documentId, updateData } = req.body;

  if (!collectionName || !documentId || !updateData) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const docRef = db.collection(collectionName).doc(documentId);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Document not found" });
    }

    const data = docSnap.data();

    if (data && data.uid !== authUid) {
      return res.status(403).json({ error: "Forbidden: You are not the owner of this document" });
    }

    // 🔒 uid フィールドは更新対象に含めないように削除
    if ("uid" in updateData) {
      delete updateData.uid;
    }

    await docRef.update(updateData);
    return res.status(200).json({ message: "Document updated successfully" });
  } catch (error) {
    console.error("Firestore update error:", error);
    return res.status(500).json({ error: "Failed to update document" });
  }
}
