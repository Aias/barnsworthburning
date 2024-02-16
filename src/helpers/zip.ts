export default function zip(keys: string[] = [], ...arrays: string[][]) {
	const numArrays = arrays.length;
	const arrayLength = arrays[0].length;
	if (arrayLength === 0) return undefined;

	const zippedArray: Record<string, string>[] = [];

	for (let i = 0; i < arrayLength; i++) {
		const obj: Record<string, string> = {};

		for (let j = 0; j < numArrays; j++) {
			const key = keys[j] || `array${j + 1}`;
			obj[key] = arrays[j][i];
		}

		zippedArray.push(obj);
	}

	return zippedArray;
}
