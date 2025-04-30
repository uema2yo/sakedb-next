
import type { NextApiRequest, NextApiResponse } from "next";
import { db, admin } from "@/lib/firebase/admin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { uid, timestamp } = req.body;

  if (!uid || !timestamp) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await db.collection("m_user").doc(uid).set({
      uid,
      timestamp,
    });
    return res.status(200).json({ message: "User document created" });
  } catch (error) {
    console.error("Firestore error:", error);
    return res.status(500).json({ error: "Failed to create document" });
  }
}
