import { auth } from "@/lib/firebase/admin";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Invalid email" });
  }

  try {
    await auth.getUserByEmail(email);
    return res.status(200).json({ exists: true }); // 登録済み
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      return res.status(200).json({ exists: false }); // 登録されていない
    }
    console.error("Auth error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
