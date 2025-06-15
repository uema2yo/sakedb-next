import { DocumentData } from "firebase/firestore";

// tailwindcss
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function generateUniqueToken(length: number = 32): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
  let token = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex];
  }
  return token;
}

export function getLabelFromCode<T extends { code: string | number; label: Record<string, string> }>(
  codes: DocumentData[],
  code: string | number,
  lang?: string
): string | undefined {
  const result = codes.find(item => item.code === code);
  return result ? result.label[lang || "ja"] : "-----"; 
}

export function formatDate(dateStr: string, lang: "ja" | "en"): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  if (lang === "ja") {
    return `${year}年${month}月${day}日`;
  } else if (lang === "en") {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  } else {
    throw new Error("Unsupported language code. Use 'ja' or 'en'.");
  }
}

export function isDateInputSupported() {
  const input = document.createElement("input");
  input.setAttribute("type", "date");
  return input.type === "date";
}

export async function loadArrayFromJSON(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data; // 配列
  } catch (error) {
    console.error("読み込みエラー:", error);
    return [];
  }
}

export function countChars(str: string): number {
  if (typeof str !== "string") {
    throw new TypeError("countChars expects a string");
  }
  let count = 0;
  for (const char of str) {
    count += char.match(/[ -~]/) ? 0.5 : 1; // 半角ASCIIは0.5、それ以外は1
  }
  return Math.ceil(count); // 小数点切り上げ
};


// tailwindcss
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
