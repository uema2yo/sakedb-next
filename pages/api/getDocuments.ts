import type { NextApiRequest, NextApiResponse } from "next";
import { getDocuments } from "@/lib/firebase/getDocuments";
import type { GetCollectionConfig } from "@/lib/firebase/getDocuments";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const configs: GetCollectionConfig[] = req.body;

    if (!Array.isArray(configs)) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }

    const data = await getDocuments(configs);
    res.status(200).json(data);
  } catch (error: unknown) {
    console.error("API error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
