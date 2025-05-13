import { updateCodes } from "@/lib/code/updateCodes";
import { DOMESTIC_REGION_CODES } from "@/constants";
import { DocumentData } from "firebase/firestore";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function updatePrefectureCodes() {
  /*
  const prefectureCodes: {
    code: string | number;
    label: string;
    domasticRegionCode: number;
  }[] = []; */

  const prefectureCodes: DocumentData[] = [];

  try {
    const prefecture = await fetch(`${baseUrl}/api/prefecture`);
    const prefectures = await prefecture.json();

    prefectures.forEach((r: { code: number; name: string }, i: number) => {
      
			// ハードコーディングした地方コードを反映させる
      const domesticRegionCode = DOMESTIC_REGION_CODES.filter(
        (domesticRegion) => domesticRegion.prefectureCodes.includes(r.code)
      )[0].code;
      prefectureCodes.push({
        code: r.code,
        label: {ja: r.name},
        domasticRegionCode: domesticRegionCode,
        order: i.toString().padStart(2, "0")
      });
    });

    updateCodes("b_code_prefecture", prefectureCodes);
  } catch (error) {
    console.error("都道府県一覧データ API の読み込みに失敗しました。");
  }
}
