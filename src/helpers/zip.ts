export default function zip(keys: string[] = [], ...arrays: string[][]) {
	const length = arrays[0]?.length;
	if (!length) return undefined;
	const zippedArray: Record<string, string>[] = [];

	for (let i = 0; i < length; i++) {
		const obj: Record<string, string> = {};

		for (let j = 0; j < arrays.length; j++) {
			const key = keys[j] || `array${j + 1}`;
			obj[key] = arrays[j][i];
		}

		zippedArray.push(obj);
	}

	return zippedArray;
}
