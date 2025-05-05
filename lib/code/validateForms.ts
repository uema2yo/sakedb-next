import { getDocuments } from "@/lib/firebase/getDocuments";
import type { GetCollectionConfig } from "@/types/getDocumentsConfig";
import { isDateInputSupported } from "../util";

export const validateForms = async (
  id: string,
  value: string | number | boolean,
  saveOnly: boolean, // 保存時のみで onChange には反応しない
  uid?: string | undefined
) => {
  const execute: {
    [key: string]: () => Promise<{
      result: boolean;
      message?: string | undefined;
    }>;
  } = {
    email: async () => {
      if (!/^[\w.+-]+@([\w-]+\.)+[\w-]{2,}$/.test(value as string)) {
        return {
          result: false,
          message: "E メールアドレスを入力してください。",
        };
      } else {
        return {
          result: true,
        };
      }
    },
    password: async () => {
      if (
        !/^[A-Za-z\d!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/.test(
          value as string
        )
      ) {
        return {
          result: false,
          message:
            "半角英数記号による最低 8 文字のパスワードを設定してください。",
        };
      } else {
        return {
          result: true,
        };
      }
    },
    id: async () => {
      if (uid === undefined) {
        return {
          result: false,
          message: "システムエラー：UID が不明です。",
        };
      }
      let duplicateItems: {
        public: boolean;
        value: string | number | boolean;
      }[] = [];
      const duplicateIdConfig: GetCollectionConfig = {
        collectionName: "b_user_id",
        conditions:
          uid === "signup"
            ? [{ name: "value", operator: "==", value: value }]
            : [
                { name: "value", operator: "==", value: value },
                { name: "uid", operator: "!=", value: uid },
              ],
      };
      duplicateItems = (await getDocuments([duplicateIdConfig])) as Array<{
        public: boolean;
        value: string | number | boolean;
      }>;
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
    name: async () => {
      return {
        result: true,
      };
    },
    birthdate: async () => {
      if (isDateInputSupported()) {
        return {
          result: true,
        }
      } else if (!/^\d{4}-\d{2}-\d{2}$/.test(value as string)) {
        return {
          result: false,
          message: "ハイフン区切りの日付の書式で入力してください。yyyy-mm-dd",
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
