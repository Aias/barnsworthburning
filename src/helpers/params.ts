export type EntityType = {
	id: 'creator' | 'space' | 'extract';
	urlParam: string;
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
		urlParam: 'creators',
		title: 'Creator',
		plural: 'Creators',
		prefix: 'creator',
		description: 'A person, group, or organization that creates or contributes to a work.'
	},
	space: {
		id: 'space',
		urlParam: 'spaces',
		title: 'Space',
		plural: 'Spaces',
		prefix: 'space',
		description: 'A topic, category, or tag that a work or extract is associated with.'
	},
	extract: {
		id: 'extract',
		urlParam: 'extracts',
		title: 'Extract',
		plural: 'Extracts',
		prefix: 'extract',
		description: 'A small fragment or larger work that has been extracted from a source.'
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

export const decodeTrail = (trail: string = ''): Segment[] =>
	trail
		.split('/')
		.map((segment) => decodeSegment(segment))
		.filter(Boolean) as Segment[];

export const encodeTrail = (segments: Segment[]): string =>
	'/' + segments.map((segment) => encodeSegment(segment.entityType, segment.id)).join('/');
