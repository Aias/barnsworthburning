type Input<Type> = {
	[Key in keyof Type]: Type[Key][];
};

export default function zip<Type>(input: Input<Type>): Type[] | undefined {
	const outputArraySize = (Object.values(input)[0] as Array<unknown>).length;

	// Check if any values in input are undefined or have length 0
	const hasUndefinedOrEmptyValues = Object.values(input).some(
		(values) =>
			values !== null && (values === undefined || (values as Array<unknown>).length === 0)
	);

	// Check if any required properties are missing in the input object
	const hasMissingProperties = Object.keys(input).some(
		(key) => input[key as keyof Type].length !== outputArraySize
	);

	if (hasUndefinedOrEmptyValues || hasMissingProperties) {
		return undefined;
	}

	return Array.from({ length: outputArraySize }, (_, idx) =>
		Object.entries(input).reduce((accumulator, [key, values]) => {
			return { ...accumulator, [key]: (values as Array<unknown>)[idx] };
		}, {} as Type)
	);
}
