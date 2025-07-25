"use client";

import React, { useEffect, useRef, useState } from "react";
import { uploadImageAsWebP } from "@/lib/firebase/uploadImage";
import { useDispatch, useSelector } from "react-redux";
import { setProfileImageUrl, clearProfileImageUrl } from "@/features/profileImage/profileImageSlice";  
import { addDocument } from "@/lib/firebase/addDocument";
import { getDocuments } from "@/lib/firebase/getDocuments";
import { GetCollectionConfig } from "@/types/getDocumentsConfig";
import { RootState } from "@/lib/store";
import { useDialog } from "@/contexts/DialogContext";

import type { UploadImageOptions } from "@/lib/firebase/uploadImage";
import Confirm from "@/components/Dialog/Confirm";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
interface Props {
  collectionName: string;
  options: UploadImageOptions
}

export default function ImageUploader(props: Props) {
  const uid = useSelector((state: RootState) => state.auth.uid) as string;
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);

  const dispatch = useDispatch(); // Redux の dispatch を取得

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { onDialogToggleButtonClick } = useDialog();

  const getImage = async() => {
    const config: GetCollectionConfig = {
      collectionName: props.collectionName,
      conditions: [{ name: "uid", operator: "==", value: uid }],
      order_by: {field: "timestamp", direction: "desc"}
    };
    return await getDocuments([config]);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setSaved(false);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    console.log("saved",saved)
    if (!saved) {
      try {
        const url = await uploadImageAsWebP(file, props.options);
        dispatch(setProfileImageUrl(url));
        await addDocument(props.collectionName,  {value: url, public: true});
        setSaved(true);
      } catch (err) {
        console.error("アップロードエラー:", err);
      } finally {
        setUploading(false);
      }
    } else {
      setSaved(false);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setImage(null);
  }

  const deleteImage = async () => {
    addDocument(props.collectionName, { deleted: true });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setPreview(null);
    setImage(null);
  }

  const handleDelete = async () => {
    onDialogToggleButtonClick("signup", "ユーザー登録", (closeDialog) => (
      <Confirm type="OK_CANCEL" func={deleteImage} onClose={closeDialog} />
    ));
  };

  const handleClick = () => {
    inputRef.current?.click();
  } 

  useEffect(() => {
    (async () => {
      const res = await getImage();
      (res.length > 0 && !res[0].deleted ) && setImage(res[0]?.value);  
    })()
  },[]);

  return (
    <div>
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={inputRef}
        className="hidden"
      />
      {preview ? (
        <div>
          <img src={preview} alt="プレビュー" width={160} />

          {file?.name && <p>ファイル名: {file?.name}</p>}
          {!saved ? (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? "アップロード中..." : "保存する"}
              </Button>
              {!uploading && (
                <Button variant="cancel" size="sm" onClick={handleCancel}>
                  取り消す
                </Button>
              )}
            </>
          ) : (
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              削除する
            </Button>
          )}
        </div>
      ) : (
        image && (
          <>
          <div>
            <img src={image} alt={`のプロフィール画像`} width={160} />
            <Button variant="destructive" onClick={handleDelete}>
              削除する
            </Button>
          </div>
          </>
        )
      )}
      <Button type="button" variant="primary" onClick={handleClick}>
        ファイルを選択
      </Button>

    </div>
  );
}
