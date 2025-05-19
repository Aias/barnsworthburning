export type EntityTypeKey = 'creator' | 'space' | 'extract';

export interface EntityType {
	key: EntityTypeKey;
	urlParam: string;
	title: string;
	plural: string;
	prefix: string;
	description: string;
}

interface Segment {
	entityType: EntityType;
	id: string;
}

export const entityTypes: Record<EntityTypeKey, EntityType> = {
	creator: {
		key: 'creator',
		urlParam: 'creators',
		title: 'Creator',
		plural: 'Creators',
		prefix: 'creator',
		description: 'A person, group, or organization that creates or contributes to a work.'
	},
	space: {
		key: 'space',
		urlParam: 'spaces',
		title: 'Space',
		plural: 'Spaces',
		prefix: 'space',
		description: 'A topic, category, or tag that a work or extract is associated with.'
	},
	extract: {
		key: 'extract',
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

export const slugify = (title: string) => {
	// Trim leading and trailing whitespace
	let slug = title.trim();

	// Convert to lowercase
	slug = slug.toLowerCase();

	// Remove all characters that are not letters, numbers, spaces, or hyphens
	slug = slug.replace(/[^a-z0-9\s-]/g, '');

	// Replace one or more spaces with a single hyphen
	slug = slug.replace(/\s+/g, '-');

	return slug;
};

export const recordIdRegex = /^rec[a-zA-Z0-9]{14}$/;
