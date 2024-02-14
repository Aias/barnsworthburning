export const entities = {
	creator: {
		id: 'creator',
		title: 'Creator',
		plural: 'Creators',
		prefix: 'creator',
		description: 'A person, group, or organization that creates or contributes to a work.'
	},
	space: {
		id: 'space',
		title: 'Space',
		plural: 'Spaces',
		prefix: 'space',
		description: 'A topic, category, or tag that a work or extract is associated with.'
	},
	extract: {
		id: 'extract',
		title: 'Extract',
		plural: 'Extracts',
		prefix: 'extract',
		description: 'A small fragment or larger work that has been extracted from a source.'
	},
	format: {
		id: 'format',
		title: 'Format',
		plural: 'Formats',
		prefix: 'format',
		description: 'A type of work or extract, or its medium, such as a book, article, or video.'
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
