import { updateCodes } from "@lib/code/updateCodes";

const fetchOptions: RequestInit = {};
if (process.env.NEXT_PUBLIC_RESAS_API_KEY) {
	fetchOptions.headers = { "X-API-KEY": process.env.NEXT_PUBLIC_RESAS_API_KEY };
}

async function getCityApi(prefCode: number) {
	if (prefCode === 0) return;
	const cityApi = await fetch(
		`https://opendata.resas-portal.go.jp/api/v1/cities?prefCode=${prefCode}`,
		fetchOptions
	);
	return await cityApi.json();
}

export async function updateCityCodes() {
	try {
		const prefectureApi = await fetch(
			"https://opendata.resas-portal.go.jp/api/v1/prefectures",
			fetchOptions
		);
		const resPrefectureApi = await prefectureApi.json();
		const resPrefectureApiResults = resPrefectureApi.result;

		resPrefectureApiResults.forEach(async (prefecture: { prefCode: number; prefName: string }) => {
			const resCityApi = await getCityApi(prefecture.prefCode);
			const resCityApiResults = resCityApi.result;
			let cityCodes: { code: string | number; label: string; prefCode: number; bigCityFlag: string }[] = [];
			resCityApiResults.forEach((r: { bigCityFlag: string; cityCode: number; cityName: string; prefCode: number; }) => {
				if (r.bigCityFlag !== "1") {
					cityCodes.push({
						code: r.cityCode,
						label: r.cityName,
						prefCode: r.prefCode,
						bigCityFlag: r.bigCityFlag
					});
				}
			});
			updateCodes("b_code_city", cityCodes);
			cityCodes = [];
		});

	} catch (error) {
		console.error("市区町村一覧データ API の読み込みに失敗しました。");
	}
}
