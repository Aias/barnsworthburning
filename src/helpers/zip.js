export default function zip(keys = [], ...arrays) {
	const length = arrays[0]?.length;
	if (!length) return undefined;
	const zippedArray = [];

	for (let i = 0; i < length; i++) {
		const obj = {};

		for (let j = 0; j < arrays.length; j++) {
			const key = keys[j] || `array${j + 1}`;
			obj[key] = arrays[j][i];
		}

		zippedArray.push(obj);
	}

	return zippedArray;
}
