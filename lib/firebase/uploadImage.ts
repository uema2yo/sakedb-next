import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/init";

/** WebP に変換するユーティリティ */
const convertToWebP = async (file: File): Promise<File> => {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;

  const ctx = canvas.getContext("2d");
  ctx?.drawImage(bitmap, 0, 0);

  const blob: Blob = await new Promise((resolve) =>
    canvas.toBlob(
      (blob) => resolve(blob!),
      "image/webp",
      0.5 // 品質
    )
  );

  return new File([blob], `${file.name.split(".")[0]}.webp`, { type: "image/webp" });
};

/** Firebase Storage にアップロード */
export const uploadImageAsWebP = async (file: File): Promise<string> => {
  const webpFile = await convertToWebP(file);
  const imageRef = ref(storage, `images/${webpFile.name}`);
  await uploadBytes(imageRef, webpFile);
  return await getDownloadURL(imageRef);
};
