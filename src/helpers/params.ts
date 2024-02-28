type EntityType = {
	id: string;
	title: string;
	plural: string;
	prefix: string;
	description: string;
};

type Segment = {
	entityType: EntityType;
	id: string;
};

export const entityTypes: Record<string, EntityType> = {
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

const getEntityTypeByPrefix = (prefix: string): EntityType | undefined =>
	Object.values(entityTypes).find((entityType) => entityType.prefix === prefix);

export const encodeSegment = (entityType: EntityType, recordId: string): string =>
	`${entityType.prefix}${segmentSeparator}${encodeURIComponent(recordId)}`;

export const decodeSegment = (segment = ''): Segment | undefined => {
	const [prefix, idString] = segment.split(segmentSeparator);
	const entityType = getEntityTypeByPrefix(prefix);
	if (!entityType) return undefined;
	return {
		entityType,
		id: decodeURIComponent(idString)
	};
};

export const decodeTrail = (trail: string): Segment[] =>
	trail
		.split('/')
		.map((segment) => decodeSegment(segment))
		.filter(Boolean) as Segment[];

export const encodeTrail = (segments: Segment[]): string =>
	segments.map((segment) => encodeSegment(segment.entityType, segment.id)).join('/');
