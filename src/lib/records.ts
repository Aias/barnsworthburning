import { PREDICATES, type MediaSelect, type PredicateSlug, type RecordSelect, type RecordType } from '@aias/hozo';

export type RecordFields = Omit<RecordSelect, 'textEmbedding'>;
export type RecordLink = Pick<RecordSelect, 'id' | 'type' | 'title' | 'slug'>;

export interface LinkGroup {
	predicate: PredicateSlug;
	label: string;
	records: RecordLink[];
}

export interface RecordCard extends RecordFields {
	media: MediaSelect[];
	creators: RecordLink[];
	tags: RecordLink[];
	format: RecordLink | null;
	parent: (RecordLink & { creators: RecordLink[] }) | null;
	children: RecordLink[];
	connections: RecordLink[];
	extras: LinkGroup[];
}

export interface RecordPage {
	record: RecordCard;
	children: RecordCard[];
	connections: RecordCard[];
	associated: RecordCard[];
}

export interface IndexEntry {
	id: number;
	title: string | null;
	type: RecordType;
	count: number;
}

export interface RecordGroup extends IndexEntry {
	top: RecordLink[];
}

export interface FeedEntry {
	record: RecordCard;
	children: RecordCard[];
}

export interface Section {
	type: RecordType;
	path: string;
	label: string;
	singular: string;
	icon: string;
}

export const sections: Record<RecordType, Section> = {
	artifact: { type: 'artifact', path: 'artifacts', label: 'Artifacts', singular: 'Artifact', icon: '📝' },
	entity: { type: 'entity', path: 'entities', label: 'Entities', singular: 'Entity', icon: '🧑‍🎨' },
	concept: { type: 'concept', path: 'concepts', label: 'Concepts', singular: 'Concept', icon: '🏷️' }
};

export const sectionByPath = (path: string): Section | undefined =>
	Object.values(sections).find((section) => section.path === path);

export const slugify = (title: string) =>
	title
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-');

export const recordSlug = (record: Pick<RecordSelect, 'title' | 'slug'>): string =>
	record.slug ?? (record.title ? slugify(record.title) : '');

export const recordPath = (record: Pick<RecordSelect, 'id' | 'title' | 'slug'>): string => {
	const slug = recordSlug(record);
	return slug ? `/records/${record.id}/${slug}` : `/records/${record.id}`;
};

export const displayTitle = (record: Pick<RecordSelect, 'title' | 'type'>): string =>
	record.title || sections[record.type].singular;

export const outgoingLabel = (predicate: PredicateSlug): string => PREDICATES[predicate].name;

export const incomingLabel = (predicate: PredicateSlug): string =>
	PREDICATES[PREDICATES[predicate].inverseSlug].name;
