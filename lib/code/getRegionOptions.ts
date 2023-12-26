import { getDocuments } from "@lib/firebase/getDocuments";

interface Option {
	value?: number,
	innerText?: string,
}

export async function getRegionOptions() {
	const options = [<Option>{}];
	const regions = await getDocuments([
		{
			collectionName: "b_code_region",
			order_by: { field: "code", direction: "asc" }
		}
	]);
	options.push({ value: 0, innerText: "----" });
	regions.map((region) => {
		options.push({ value: region.code, innerText: region.label });
	});
	return options;
}
