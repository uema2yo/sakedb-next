export const SITE_TITLE = "SAKE DB";
export const SUB_TITLE = "サブタイトル";
export const DOMAIN = "http://localhost:3000"; // デプロイ後、ドメイン取得後に随時書き換え
export const LOCAL_DOMAIN = "http://localhost:3000";
export const GENDER_CODES = [
  { code: 1, label: "男性" },
  { code: 2, label: "女性" },
  { code: 9, label: "どちらでもない" },
  { code: 0, label: "無回答" },
];
export const DOMESTIC_REGION_CODES = [
  { code: 1, label: "北海道", prefectureCodes: [1] },
  { code: 2, label: "東北", prefectureCodes: [2, 3, 4, 5, 6, 7] },
  { code: 3, label: "関東", prefectureCodes: [8, 9, 10, 11, 12, 13, 14] },
  {
    code: 4,
    label: "中部",
    prefectureCodes: [15, 16, 17, 18, 19, 20, 21, 22, 23],
  },
  { code: 5, label: "近畿", prefectureCodes: [24, 25, 26, 27, 28, 29, 30] },
  { code: 6, label: "中国", prefectureCodes: [31, 32, 33, 34, 35] },
  { code: 7, label: "四国", prefectureCodes: [36, 37, 38, 39] },
  {
    code: 8,
    label: "九州（沖縄を含む）",
    prefectureCodes: [40, 41, 42, 43, 44, 45, 46, 47],
  }
];
