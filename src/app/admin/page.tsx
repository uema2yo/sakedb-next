"use client";

import React, { useState, MouseEventHandler } from "react";
import { getDocuments } from "@/lib/firebase/getDocuments";
import { updateRegionCodes } from "@/lib/code/updateRegionCodes";
import { updateCountryCodes } from "@/lib/code/updateCountryCodes";
import { updatePrefectureCodes } from "@/lib/code/updatePrefectureCodes";
import { updateCityCodes } from "@/lib/code/updateCityCodes";
import { useLoginContext } from "@/contexts/LoginContext";
import Loading from "@/components/Loading";

const apiImportHandler: MouseEventHandler<HTMLButtonElement> = async (e) => {
  const target = e.target as HTMLButtonElement;
  switch (target.name) {
    case "updateRegionCodes":
      await updateRegionCodes();
      break;
    case "updateCountryCodes":
      await updateCountryCodes();
      break;
    case "updatePrefectureCodes":
      updatePrefectureCodes();
      break;
    case "updateCityCodes":
      updateCityCodes();
      break;
    case "openPrefectureCodes":
      break;
  }
};

const openEditorHandler: MouseEventHandler<HTMLButtonElement> = async (e) => {
  const target = e.target as HTMLButtonElement;
  console.log(target);
};

const Page = () => {
  const { loginInfo, loginLoading } = useLoginContext();
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  if (loginLoading) return <Loading />;

  (async () => {
    try {
      const documents = await getDocuments([
        {
          collectionName: "b_user_id",
          conditions: [{ name: "uid", operator: "==", value: loginInfo?.uid || "" }],
          public_only: false,
          order_by: { field: "timestamp", direction: "desc" },
          limit_num: 1,
        },
        {
          collectionName: "b_user_name",
          conditions: [{ name: "uid", operator: "==", value: loginInfo?.uid || "" }],
          public_only: false,
          order_by: { field: "timestamp", direction: "desc" },
          limit_num: 1,
        },
      ]);
      setUserId(documents[0] && documents[0].value);
      setUserName(documents[1] && documents[1].value);
      setLoading(false);
    } catch (error) {
      console.error("Failed to check login:", error);
    }
  })();

  return (
      <>
        <header>
          <h1>管理画面</h1>
          {loginInfo?.admin ? (
            <>
              <p>
                管理者 {userName}（ID: {userId}） でログイン中
              </p>
            </>
          ) : (
            <p>
              管理者専用ページです。管理者アカウントでログインしてください。
            </p>
          )}
        </header>

        {loginInfo?.admin && (
          <>
            <article>
              <h2>地域コード</h2>
              <button
                type="button"
                name="updateRegionCodes"
                onClick={apiImportHandler}
              >
                REST Countries API で上書きする
              </button>
              <button
                type="button"
                name="openRegionCodes"
                onClick={openEditorHandler}
                disabled={true}
              >
                手動編集画面を開く
              </button>
            </article>
            <article>
              <h2>国コード</h2>
              <button
                type="button"
                name="updateCountryCodes"
                onClick={apiImportHandler}
              >
                REST Countries API で上書きする
              </button>
              <button
                type="button"
                name="openCountryCodes"
                onClick={openEditorHandler}
                disabled={true}
              >
                手動編集画面を開く
              </button>
            </article>
            <article>
              <h2>都道府県コード</h2>
              <button
                type="button"
                name="updatePrefectureCodes"
                onClick={apiImportHandler}
              >
                MLIT DATA API で上書きする
              </button>
              <button
                type="button"
                name="openPrefectureCodes"
                onClick={openEditorHandler}
                disabled={true}
              >
                手動編集画面を開く
              </button>
            </article>
            <article>
              <h2>市区町村コード</h2>
              <button
                type="button"
                name="updateCityCodes"
                onClick={apiImportHandler}
              >
                MLIT DATA API で上書きする
              </button>
              <button
                type="button"
                name="openCityCodes"
                onClick={openEditorHandler}
                disabled={true}
              >
                手動編集画面を開く
              </button>
            </article>
          </>
        )}
      </>
  );
};

export default Page;
