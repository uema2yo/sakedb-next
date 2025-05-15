import admin from "firebase-admin";
import sharp from "sharp";
import path from "path";
import os from "os";
import fs from "fs";
import { onObjectFinalized } from "firebase-functions/v2/storage";

admin.initializeApp();

export const resizeImage = onObjectFinalized(
  {
    bucket: "your-bucket-name",
  },
  async (event) => {
    const object = event.data;
    const filePath = object.name || "";
    const contentType = object.contentType || "";
    if (!filePath.startsWith("uploads/") || !contentType.startsWith("image/")) {
      console.log("対象外のファイルです:", filePath);
      return;
    }

    const bucket = admin.storage().bucket();
    const fileName = path.basename(filePath);
    const tempFilePath = path.join(os.tmpdir(), fileName);
    const metadata = {
      contentType: contentType,
    };

    // 1. ローカルにダウンロード
    await bucket.file(filePath).download({ destination: tempFilePath });

    // 2. Sharp でリサイズ（例：正方形にトリミングし、幅300pxに）
    const processedPath = tempFilePath + "_resized.jpg";
    await sharp(tempFilePath)
      .resize(300, 300, { fit: "cover" })
      .jpeg({ quality: 80 })
      .toFile(processedPath);

    // 3. アップロード（別名）
    const newFilePath = filePath.replace("uploads/", "resized/");
    await bucket.upload(processedPath, {
      destination: newFilePath,
      metadata: metadata,
    });

    // 4. 一時ファイル削除
    fs.unlinkSync(tempFilePath);
    fs.unlinkSync(processedPath);

    return;
  }
);
/*
export const resizeImage = functions.storage
  .object()
  .onFinalize(async (object: { name: string; contentType: string; }) => {
    const filePath = object.name || "";
    const contentType = object.contentType || "";
    if (!filePath.startsWith("uploads/") || !contentType.startsWith("image/")) {
      console.log("対象外のファイルです:", filePath);
      return;
    }

    const bucket = admin.storage().bucket();
    const fileName = path.basename(filePath);
    const tempFilePath = path.join(os.tmpdir(), fileName);
    const metadata = {
      contentType: contentType,
    };

    // 1. ローカルにダウンロード
    await bucket.file(filePath).download({ destination: tempFilePath });

    // 2. Sharp でリサイズ（例：正方形にトリミングし、幅300pxに）
    const processedPath = tempFilePath + "_resized.jpg";
    await sharp(tempFilePath)
      .resize(300, 300, { fit: "cover" })
      .jpeg({ quality: 80 })
      .toFile(processedPath);

    // 3. アップロード（別名）
    const newFilePath = filePath.replace("uploads/", "resized/");
    await bucket.upload(processedPath, {
      destination: newFilePath,
      metadata: metadata,
    });

    // 4. 一時ファイル削除
    fs.unlinkSync(tempFilePath);
    fs.unlinkSync(processedPath);

    return;
  });*/
