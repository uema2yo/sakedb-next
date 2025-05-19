import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/init";

export type UploadImageOptions =
  | { width: number; height?: number; aspectKeep: boolean; maxDataSize?: number }
  | { width?: number; height: number; aspectKeep: boolean; maxDataSize?: number };

const convertToWebP = async (file: File, options: UploadImageOptions): Promise<File> => {
  const bitmap = await createImageBitmap(file);
  const originalWidth = bitmap.width;
  const originalHeight = bitmap.height;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas context not available");

  let targetWidth = options.width || 0;
  let targetHeight = options.height || 0;

  if (options.aspectKeep) {
    const aspectRatio = originalWidth / originalHeight;

    if (options.width && !options.height) {
      targetHeight = Math.round(options.width / aspectRatio);
    } else if (!options.width && options.height) {
      targetWidth = Math.round(options.height * aspectRatio);
    } else if (options.width && options.height) {
      // 両方指定されていたら幅優先で調整（必要なら高さ優先にも変更可能）
      targetHeight = Math.round(options.width / aspectRatio);
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.drawImage(bitmap, 0, 0, originalWidth, originalHeight, 0, 0, targetWidth, targetHeight);

  } else {
    const side = Math.min(originalWidth, originalHeight);
    const sx = (originalWidth - side) / 2;
    const sy = (originalHeight - side) / 2;

    targetWidth = targetWidth || side;
    targetHeight = targetHeight || side;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, targetWidth, targetHeight);
  }

  let quality = 0.9;
  let blob: Blob | null = null;

  while (quality > 0.1) {
    blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/webp", quality)
    );
    if (blob && blob.size <= (options.maxDataSize || 250) * 1024) break;
    quality -= 0.1;
  }

  if (!blob) throw new Error("画像の圧縮に失敗しました");

  return new File([blob], `${file.name.split(".")[0]}.webp`, { type: "image/webp" });
};

export const uploadImageAsWebP = async (file: File, options: UploadImageOptions): Promise<string> => {
  const webpFile = await convertToWebP(file, options);
  const imageRef = ref(storage, `images/${webpFile.name}`);
  await uploadBytes(imageRef, webpFile);
  return await getDownloadURL(imageRef);
};
