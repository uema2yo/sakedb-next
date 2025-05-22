import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  type DocumentData,
  type WhereFilterOp,
  type OrderByDirection,
} from "firebase/firestore";
import { db } from "./init";

export interface Condition {
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
  const results: DocumentData[][] = [];

  for (const config of configs) {
    const { collectionName, conditions, public_only, order_by, limit_num } = config;
    const ref = collection(db, collectionName);
    const constraints: any[] = [];

    if (conditions?.length) {
      constraints.push(...conditions.map((c) => where(c.name, c.operator, c.value)));
    }
    if (public_only) {
      constraints.push(where("public", "==", true));
    }
    if (order_by) {
      constraints.push(orderBy(order_by.field, order_by.direction));
    }
    if (limit_num) {
      constraints.push(limit(limit_num));
    }

    const q = query(ref, ...constraints);
    const snapshot = await getDocs(q);

    results.push(snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    })));
  }

  return results.flat();
}
