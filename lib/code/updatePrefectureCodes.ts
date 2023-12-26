import { updateCodes } from "@lib/code/updateCodes";
import { DOMESTIC_REGION_CODES } from "@constants";

const fetchOptions: RequestInit = {};
if (process.env.NEXT_PUBLIC_RESAS_API_KEY) {
  fetchOptions.headers = { "X-API-KEY": process.env.NEXT_PUBLIC_RESAS_API_KEY };
}

export async function updatePrefectureCodes() {
  try {
    const prefecture = await fetch(
      "https://opendata.resas-portal.go.jp/api/v1/prefectures",
      fetchOptions
    );

    const prefectureCodes: {
      code: string | number;
      label: string;
      domasticRegionCode: number;
    }[] = [];

    const res = await prefecture.json();

    res.result.forEach((r: { prefCode: number; prefName: string }) => {
			// ハードコーディングした地方コードを反映させる
      const domesticRegionCode = DOMESTIC_REGION_CODES.filter(
        (domesticRegion) => domesticRegion.prefectureCodes.includes(r.prefCode)
      )[0].code;
      prefectureCodes.push({
        code: r.prefCode,
        label: r.prefName,
        domasticRegionCode: domesticRegionCode,
      });
    });

    updateCodes("b_code_prefecture", prefectureCodes);
  } catch (error) {
    console.error("都道府県一覧データ API の読み込みに失敗しました。");
  }
}
