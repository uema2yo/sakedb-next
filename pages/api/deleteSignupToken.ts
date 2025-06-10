import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebase/init";
import { doc, deleteDoc } from "firebase/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Missing token" });
  }

  try {
    await deleteDoc(doc(db, "signup_tokens", token));
    return res.status(200).json({ message: "Token deleted" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete token" });
  }
}
