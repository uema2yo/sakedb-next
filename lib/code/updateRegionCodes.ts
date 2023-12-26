import { updateCodes } from "@lib/code/updateCodes";

const fetchOptions: RequestInit = {};
if (process.env.NEXT_PUBLIC_RESAS_API_KEY) {
  fetchOptions.headers = { "X-API-KEY": process.env.NEXT_PUBLIC_RESAS_API_KEY };
}

export async function updateRegionCodes() {
  try {
    const region = await fetch(
      "https://opendata.resas-portal.go.jp/api/v1/regions/broad",
      fetchOptions
    );

    const regionCodes: { code: string | number; label: string }[] = [];

    const res = await region.json();

    res.result.forEach((r: { regionCode: number; regionName: string }) => {
      regionCodes.push({ code: r.regionCode, label: r.regionName });
    });

    //addDocuments("b_code_region", regionCodes);
    updateCodes("b_code_region", regionCodes);
  } catch (error) {
    console.error("地域一覧データ API の読み込みに失敗しました。");
  }
}
