"use client";

import React, { useState } from "react";
import { uploadImageAsWebP } from "@/lib/firebase/uploadImage";

interface Props {
  onUploadComplete: (url: string) => void;
}

export default function ImageUploader({ onUploadComplete }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setUploadedUrl(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageAsWebP(file);
      onUploadComplete(url);
    } catch (err) {
      console.error("アップロードエラー:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1>画像アップローダー（WebP変換）</h1>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <div>
          <img src={preview} alt="プレビュー" width={160} />
          <p>ファイル名: {file?.name}</p>
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? "アップロード中..." : "保存する"}
          </button>
        </div>
      )}
    </div>
  );
}
