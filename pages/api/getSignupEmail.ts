// pages/api/getSignupEmail.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/firebase/init";
import { doc, getDoc } from "firebase/firestore";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = req.query.token as string;

  if (!token) {
    return res.status(400).json({ error: "Missing token" });
  }

  const docSnap = await getDoc(doc(db, "signup_tokens", token));
  if (!docSnap.exists()) {
    return res.status(404).json({ error: "Invalid or expired token" });
  }

  return res.status(200).json({ email: docSnap.data().email });
}
