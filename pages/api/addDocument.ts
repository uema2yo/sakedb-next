import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebase/admin"; // firebase-admin の Firestore

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { collectionName, document, uid } = req.body;

    if (
      typeof collectionName !== "string" ||
      typeof uid !== "string" ||
      typeof document !== "object" ||
      document === null
    ) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const timestamp = Date.now();
    const newDocument = {
      ...document,
      timestamp: document.timestamp || timestamp,
      uid: document.uid || uid,
    };

    const docRef = await db.collection(collectionName).add(newDocument);

    res.status(200).json({ message: "Document added successfully", id: docRef.id });
  } catch (error: any) {
    console.error("Add document error:", error);
    res.status(500).json({ error: error?.message || String(error) });
  }
}
