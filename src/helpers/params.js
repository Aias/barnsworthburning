export const entities = {
	creator: {
		id: 'creator',
		title: 'Creator',
		plural: 'Creators',
		prefix: 'creator'
	},
	space: {
		id: 'space',
		title: 'Space',
		plural: 'Spaces',
		prefix: 'space'
	},
	extract: {
		id: 'extract',
		title: 'Extract',
		plural: 'Extracts',
		prefix: 'extract'
	},
	format: {
		id: 'format',
		title: 'Format',
		plural: 'Formats',
		prefix: 'format'
	}
};

const segmentSeparator = '.';

const getEntityByPrefix = (prefix) => Object.values(entities).find((entity) => entity.prefix === prefix);

export const encodeSegment = (entity, recordId) => `${entity.prefix}${segmentSeparator}${encodeURIComponent(recordId)}`;

export const decodeSegment = (segment = '') => {
	const [prefix, idString] = segment.split(segmentSeparator);
	return {
		entity: getEntityByPrefix(prefix),
		id: decodeURIComponent(idString)
	};
};
