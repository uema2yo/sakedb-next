interface Option {
	value: number,
	label: string
}

export function getGenderOptions() {
	const genders = [
		{ code: 1, label: "男性" },
		{ code: 2, label: "女性" },
		{ code: 9, label: "どちらでもない" },
		{ code: 0, label: "無回答" }
	];
	const options = [<Option>{}];
	genders.map((gender) => {
		options.push({ value: gender.code, label: gender.label });
	});
	return options;
}
