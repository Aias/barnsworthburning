type Input<Type> = {
	[Key in keyof Type]?: Type[Key][];
};

export default function zip<Type extends Record<string, unknown>>(
	input: Input<Type>
): Type[] | undefined {
	if (Object.values(input).some((value) => value.length === 0)) {
		return undefined;
	}
	const outputArraySize = (Object.values(input)[0] as Array<unknown>).length;

	return Array.from({ length: outputArraySize }, (_, idx) =>
		Object.entries(input).reduce((accumulator, [key, values]) => {
			return { ...accumulator, [key]: values[idx] };
		}, {} as Type)
	);
}
