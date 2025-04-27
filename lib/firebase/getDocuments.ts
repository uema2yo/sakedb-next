import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  QuerySnapshot
} from "firebase/firestore";
import { db } from "@lib/firebase/init";
import type {
  WhereFilterOp,
  OrderByDirection,
  DocumentData
} from "firebase/firestore";

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

export async function getDocuments(
  configs: GetCollectionConfig[]
): Promise<DocumentData[]> {
  try {
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
      return querySnapshot.docs.map((doc) => doc.data());
    });

    const results = await Promise.all(promises);
    const mergedDocs = results.flat();

    return mergedDocs;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}
