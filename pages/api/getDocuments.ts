import type { NextApiRequest, NextApiResponse } from "next";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  type WhereFilterOp,
  type OrderByDirection,
  type DocumentData,
  type QuerySnapshot
} from "firebase/firestore";
import { db } from "@/lib/firebase/init";

interface Condition {
  name: string;
  operator: WhereFilterOp;
  value: string | number | boolean;
}

export interface GetCollectionConfig {
  collectionName: string;
  conditions?: Condition[] | null;
  public_only?: boolean | null;
  order_by?: {
    field: string;
    direction: OrderByDirection;
  } | null;
  limit_num?: number | null;
}

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

    const promises = configs.map(async (config) => {
      const { collectionName, conditions, public_only, order_by, limit_num } = config;
      const collectionRef = collection(db, collectionName);
      let q = query(collectionRef);

      if (conditions && conditions.length > 0) {
        q = query(
          q,
          ...conditions.map((condition) =>
            where(condition.name, condition.operator, condition.value)
          )
        );
      }
      if (public_only) {
        q = query(q, where("public", "==", true));
      }
      if (order_by && order_by.field && order_by.direction) {
        q = query(q, orderBy(order_by.field, order_by.direction));
      }
      if (limit_num) {
        q = query(q, limit(limit_num));
      }

      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

      const documents = querySnapshot.docs.map((doc) => doc.data());

      return documents;
    });

    const results = await Promise.all(promises);
    const mergedDocs = results.flat();

    res.status(200).json(mergedDocs);
  } catch (error: unknown) {
    console.error("Firestore access error:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
