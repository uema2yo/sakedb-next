import { DocumentData } from "firebase/firestore";

export const SITE_TITLE = "SAKE DB";
export const SUB_TITLE = "サブタイトル";
export const DOMAIN = "http://localhost:3000"; // デプロイ後、ドメイン取得後に随時書き換え
export const LOCAL_DOMAIN = "http://localhost:3000";
export const GENDER_CODES:DocumentData[] = [
  { code: 1, label: {ja: "男性"} },
  { code: 2, label: {ja: "女性"} },
  { code: 9, label: {ja: "どちらでもない"} },
  { code: 0, label: {ja: "無回答"} },
] as const;

type DomesticRegion = {
  code: number;
  label: {[key: string]: string};
  prefectureCodes: number[];
};

export const DOMESTIC_REGION_CODES: DomesticRegion[] = [
  { code: 1, label: {ja: "北海道"}, prefectureCodes: [1] },
  { code: 2, label: {ja: "東北"}, prefectureCodes: [2, 3, 4, 5, 6, 7] },
  { code: 3, label: {ja: "関東"}, prefectureCodes: [8, 9, 10, 11, 12, 13, 14] },
  {
    code: 4,
    label: {ja: "中部"},
    prefectureCodes: [15, 16, 17, 18, 19, 20, 21, 22, 23],
  },
  { code: 5, label: {ja: "近畿"}, prefectureCodes: [24, 25, 26, 27, 28, 29, 30] },
  { code: 6, label: {ja: "中国"}, prefectureCodes: [31, 32, 33, 34, 35] },
  { code: 7, label: {ja: "四国"}, prefectureCodes: [36, 37, 38, 39] },
  {
    code: 8,
    label: {ja: "九州（沖縄を含む）"},
    prefectureCodes: [40, 41, 42, 43, 44, 45, 46, 47],
  }
] as const;
export type ValidationErrorCode =
  | "REQUIRED"
  | "INVALID_FORMAT"
  | "INVALID_CHAR_ALNUM"
  | "TOO_SHORT"
  | "TOO_LONG"
  | "NOT_MATCH"
  | "INVALID_CHAR"
  | "OUT_OF_RANGE"
  | "ALREADY_EXISTS";

export const VALIDATION_ERROR_CODES: {[key in ValidationErrorCode]: string} = {
  REQUIRED: "この項目は必須です。",
  INVALID_FORMAT: "フォーマットが正しくありません。",
  INVALID_CHAR_ALNUM: "半角英数と「_」以外は使用できません。",
  TOO_SHORT: "入力が短すぎます。",
  TOO_LONG: "入力が長すぎます。",
  NOT_MATCH: "入力が一致しません。",
  INVALID_CHAR: "使用できない文字が含まれています。",
  OUT_OF_RANGE: "許可されている範囲外の値です。",
  ALREADY_EXISTS: "既に使用されています。",
}
