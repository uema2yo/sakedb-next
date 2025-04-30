import type { WhereFilterOp, OrderByDirection } from "firebase/firestore";

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
