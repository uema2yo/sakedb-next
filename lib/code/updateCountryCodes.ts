import { updateCodes } from "@lib/code/updateCodes";

const fetchOptions: RequestInit = {};
if (process.env.NEXT_PUBLIC_RESAS_API_KEY) {
	fetchOptions.headers = { "X-API-KEY": process.env.NEXT_PUBLIC_RESAS_API_KEY };
}

async function getCountryApi(regionCode: number) {
	if (regionCode === 0) return;
	const countryApi = await fetch(
		"https://opendata.resas-portal.go.jp/api/v1/regions/middle?regionCode=" + regionCode,
		fetchOptions
	);
	return await countryApi.json();
}

export async function updateCountryCodes() {
	try {
		const regionApi = await fetch(
			"https://opendata.resas-portal.go.jp/api/v1/regions/broad",
			fetchOptions
		);
		const resRegionApi = await regionApi.json();
		const resRegionApiResults = resRegionApi.result;
		//輸出国コードなので日本が無い
		const japan = {
			code: 192,
			label: "日本",
			regionCode: 1,
			remarks: ""
		};
		//消滅した国家を除外
		const abolitions = [214, 136, 142, 148, 226, 313, 623];

		resRegionApiResults.forEach(async (region: { regionCode: number; regionName: string }) => {
			const resCountryApi = await getCountryApi(region.regionCode);
			const resCountryApiResults = resCountryApi.result;
			let countryCodes = [];
			if (region.regionCode === 1) countryCodes.push(japan);
			resCountryApiResults.forEach(
				(r: { countryCode: number; countryName: string; regionCode: number; remarks: string }) => {
					if (abolitions.indexOf(r.countryCode) < 0) {
						countryCodes.push({
							code: r.countryCode,
							label: r.countryName,
							regionCode: r.regionCode,
							remarks: r.remarks
						});
					}
				}
			);
			updateCodes("b_code_country", countryCodes);
			countryCodes = [];
		});
	} catch (error) {
		console.error("国一覧データ API の読み込みに失敗しました。");
	}
}
