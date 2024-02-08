export const prefixes = {
	creator: 'creator',
	space: 'space',
	extract: 'extract',
	type: 'type'
};

const segmentSeparator = '.';

export const encodeId = (type, id) => `${prefixes[type]}${segmentSeparator}${encodeURIComponent(id)}`;

export const decodeId = (id) => {
	const [type, idString] = id.split(segmentSeparator);
	return {
		type: Object.keys(prefixes).find((key) => prefixes[key] === type),
		id: decodeURIComponent(idString)
	};
};
