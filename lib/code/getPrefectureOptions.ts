import { getDocuments } from "@lib/firebase/getDocuments";

interface Option {
	value: number,
	innerText: string
}

export async function getPrefectureOptions() {
	const options = [<Option>{}];
	const prefectures = await getDocuments([
		{
			collectionName: "b_code_prefecture",
			order_by: { field: "code", direction: "asc" }
		}
	]);
	prefectures.map((prefecture) => {
		if (prefecture.code === 13) {
			options.push({ value: 0, innerText: "----" });
		}
		options.push({ value: prefecture.code, innerText: prefecture.label });
	});
	return options;
}
