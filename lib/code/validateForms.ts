import { getDocuments } from "@/lib/firebase/getDocuments";
import type { GetCollectionConfig } from "@/types/getDocumentsConfig";

export const validateForms = async (
  id: string,
  value: string | number | boolean,
  uid?: string | undefined
) => {
  const execute: {
    [key: string]: () => Promise<{
      result: boolean;
      message?: string | undefined;
    }>;
  } = {
    email: async() => {
      if (!/^[\w.+-]+@([\w-]+\.)+[\w-]{2,}$/.test(value as string)) {
        return {
          result: false,
          message: "E メールアドレスを入力してください。",
        };
      } else {
        return {
          result: true
        };
      }
    },
    password: async() => {
      if (!/^[A-Za-z\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/.test(value as string)) {
          return {
          result: false,
          message: "半角英数記号による最低 8 文字のパスワードを設定してください。"
        }
      } else {
        return {
          result: true
        }
      }
    },
    id: async () => {
      console.log(value)
      if (uid === undefined  ) {
        return {
          result: false,
          message: "システムエラー：UID が不明です。"
        }
      }
      const duplicateIdConfig: GetCollectionConfig = {
        collectionName: "b_user_id",
        conditions: uid === "signup" ? [
          { name: "value", operator: "==", value: value },
        ]: [
          { name: "value", operator: "==", value: value },
          { name: "uid", operator: "!=", value: uid },
        ],
      };

      console.log(duplicateIdConfig)
      const duplicateItems = (await getDocuments([
        duplicateIdConfig,
      ])) as Array<{ public: boolean; value: string | number | boolean }>;

      console.log("duplicateItems", id, duplicateItems);
      if (/[^a-zA-Z0-9_]/.test(value as string)) {
        return {
          result: false,
          message: `ユーザー ID は、半角英数と「_」以外は使用できません。`,
        };
      } else if (duplicateItems.length > 0) {
        return {
          result: false,
          message: `このユーザー ID は、他のユーザーがすでに使用しています。`,
        };
      } else {
        return {
          result: true,
        };
      }
    },
  };
  return await execute[id]();
};
