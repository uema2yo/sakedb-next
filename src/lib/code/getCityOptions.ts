import { getDocuments } from "@/lib/firebase/getDocuments";

interface Option {
	value?: number,
	innerText?: string,
	prefCode?: number
}

export async function getCityOptions(prefCode: number) {
	const options = [<Option>{}];
	const cities = await getDocuments([
		{
			collectionName: "b_code_city",
			conditions: [
				{
					name: "prefCode",
					operator: "==",
					value: prefCode
				}
			],
			order_by: { field: "code", direction: "asc" }
		}
	]);
	options.push({ value: 0, innerText: "----", prefCode: 0});
	cities.map((city) => {
		options.push({ value: city.code, innerText: city.label, prefCode: city.prefCode });
	});
	return options;
}
