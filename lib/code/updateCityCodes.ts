import { updateCodes } from "@/lib/code/updateCodes";
import { DocumentData } from "firebase/firestore";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


const fetchOptions: RequestInit = {};
if (process.env.NEXT_PUBLIC_RESAS_API_KEY) {
	fetchOptions.headers = { "X-API-KEY": process.env.NEXT_PUBLIC_RESAS_API_KEY };
}

async function getCityApi(prefCode: number) {
	if (prefCode > 0) {
		const cityApi = await fetch(`${baseUrl}/api/city?prefCode=${prefCode}`);
		return await cityApi.json();
	} else {
		return null;
	}
}

export async function updateCityCodes() {
	try {
    const prefecture = await fetch(`${baseUrl}/api/prefecture`);
    const prefectures = await prefecture.json();

		/*
		const prefectureApi = await fetch(
			"https://opendata.resas-portal.go.jp/api/v1/prefectures",
			fetchOptions
		);
		const resPrefectureApi = await prefectureApi.json();
		const resPrefectureApiResults = resPrefectureApi.result;
*/
		prefectures.forEach(async (prefecture: { code: number; name: string }) => {
      const cities = await getCityApi(prefecture.code);
      /*
      let cityCodes: {
        code: string | number;
        label: string;
        prefCode: number;
      }[] = []; */
      let cityCodes: DocumentData[] = [];
      cities.forEach(
        //(r: { code: number; name: string; prefecture_code: number }) => {
        (r: DocumentData) => {
          cityCodes.push({
            code: r.code,
            label: {ja: r.name},
            prefecture: r.prefecture_code,
          });
        }
      );
      updateCodes("b_code_city", cityCodes);
      cityCodes = [];
    });

	} catch (error) {
		console.error("市区町村一覧データ API の読み込みに失敗しました。");
	}
}
