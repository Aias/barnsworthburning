import { capitalize } from '#helpers/grammar.js';
import { resolve } from '$app/paths';
import {
	PREDICATES,
	type MediaSelect,
	type PredicateSlug,
	type RecordSelect,
	type RecordType
} from '@aias/hozo';
import {
	ArrowLeftRightIcon,
	ArrowRightIcon,
	AtSignIcon,
	CircleDotIcon,
	CornerDownRightIcon,
	EqualIcon,
	FileTextIcon,
	HashIcon,
	LightbulbIcon,
	PenLineIcon,
	ReplyIcon,
	UserIcon,
	type LucideIcon
} from '@lucide/svelte';

export type RecordFields = Pick<
	RecordSelect,
	| 'id'
	| 'type'
	| 'title'
	| 'slug'
	| 'abbreviation'
	| 'sense'
	| 'summary'
	| 'content'
	| 'mediaCaption'
	| 'notes'
	| 'url'
	| 'avatarUrl'
	| 'contentCreatedAt'
	| 'contentUpdatedAt'
	| 'recordCreatedAt'
	| 'recordUpdatedAt'
>;
export type PublicMedia = Pick<
	MediaSelect,
	'id' | 'type' | 'url' | 'altText' | 'width' | 'height' | 'contentTypeString' | 'fileSize'
>;
export type PreviewMedia = Pick<PublicMedia, 'type' | 'url' | 'altText'>;
export type RecordLink = Pick<RecordSelect, 'id' | 'type' | 'title' | 'slug'>;

export interface LinkGroup {
	predicate: PredicateSlug;
	label: string;
	direction: 'outgoing' | 'incoming';
	records: RecordLink[];
}

export interface RecordAttachment extends RecordLink {
	creators: RecordLink[];
	preview: string | null;
}

export interface RecordCard extends RecordFields {
	media: PublicMedia[];
	creators: RecordLink[];
	attributions: LinkGroup[];
	tags: RecordLink[];
	format: RecordLink | null;
	parents: (RecordLink & { creators: RecordLink[] })[];
	quoted: RecordAttachment[];
	respondsTo: RecordAttachment[];
	children: RecordLink[];
	childPreview: string | null;
	childMedia: PreviewMedia | null;
	references: LinkGroup[];
	connections: RecordLink[];
	extras: LinkGroup[];
}

export interface ReferenceGroup {
	label: string;
	records: RecordCard[];
}

export interface RecordPage {
	record: RecordCard;
	references: ReferenceGroup[];
	children: RecordCard[];
	relations: LinkGroup[];
	associated: RecordCard[];
}

export interface RelationRow {
	symbol: LucideIcon | string;
	label: string;
	items: RecordLink[];
}

export interface IndexEntry extends RecordLink {
	count: number;
}

export interface RecordGroup extends IndexEntry {
	top: RecordLink[];
}

export interface FeedEntry {
	record: RecordCard;
	children: FeedEntry[];
}

export interface Section {
	type: RecordType;
	path: string;
	label: string;
	singular: string;
}

export const sections: Record<RecordType, Section> = {
	artifact: { type: 'artifact', path: 'artifacts', label: 'Artifacts', singular: 'Artifact' },
	entity: { type: 'entity', path: 'entities', label: 'Entities', singular: 'Entity' },
	concept: { type: 'concept', path: 'concepts', label: 'Concepts', singular: 'Concept' }
};

// Sections travel through `load` payloads, which SvelteKit serializes, so the
// icon components live in a parallel map rather than on the Section itself.
export const sectionIcons: Record<RecordType, LucideIcon> = {
	artifact: FileTextIcon,
	entity: UserIcon,
	concept: LightbulbIcon
};

const relationSymbols: Partial<Record<PredicateSlug, LucideIcon>> = {
	references: AtSignIcon,
	about: CircleDotIcon,
	responds_to: ReplyIcon,
	created_by: PenLineIcon,
	same_as: EqualIcon,
	related_to: ArrowLeftRightIcon,
	tagged_with: HashIcon,
	contained_by: CornerDownRightIcon
};

export const relationRows = (groups: LinkGroup[]): RelationRow[] => {
	const rows = new Map<RelationRow['symbol'], { labels: string[]; items: RecordLink[] }>();
	for (const group of groups) {
		const symbol =
			group.predicate === 'counters'
				? capitalize(group.label)
				: (relationSymbols[group.predicate] ?? ArrowRightIcon);
		const row = rows.get(symbol) ?? { labels: [], items: [] };
		const seen = new Set(row.items.map((item) => item.id));
		row.labels.push(group.label);
		row.items.push(...group.records.filter((item) => !seen.has(item.id)));
		rows.set(symbol, row);
	}
	return [...rows].map(([symbol, { labels, items }]) => ({
		symbol,
		label: labels.map(capitalize).join(', '),
		items
	}));
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

export const recordPath = (record: Pick<RecordSelect, 'id' | 'title' | 'slug'>) =>
	resolve('/records/[id=id]/[[slug]]', {
		id: record.id,
		slug: recordSlug(record) || undefined
	});

export const displayTitle = (record: Pick<RecordSelect, 'title' | 'type'>): string =>
	record.title || sections[record.type].singular;

export const visualMedia = <T extends Pick<MediaSelect, 'type'>>(media: T[]): T[] =>
	media.filter((item) => item.type === 'image' || item.type === 'video');

export const recordPreview = (
	record: Pick<RecordSelect, 'summary' | 'content' | 'mediaCaption' | 'notes'>
): string | null => record.summary || record.content || record.mediaCaption || record.notes;

// Format concepts carry plural titles ("Essays", "Research Papers"); the
// citation line needs the noun for a single record of that format ("An essay
// by …"). Labels are lowercase. Overrides, keyed by the whole title or its last
// word, cover irregular plurals, mass nouns, and phrases the suffix rules can't
// derive ("Poetry" → "A poem by …"), and spell out their own casing.
const singularOverrides: Partial<Record<string, string>> = {
	advice: 'piece of advice',
	art: 'artwork',
	automata: 'automaton',
	fiction: 'fiction story',
	media: 'media work',
	memetics: 'meme',
	memoranda: 'memorandum',
	movies: 'movie',
	'opposite-the-editorial': 'op-ed',
	photography: 'photograph',
	poetry: 'poem',
	prototyping: 'prototype',
	'question and answer': 'Q&A',
	series: 'series',
	standup: 'standup special',
	summarization: 'summary',
	theses: 'thesis'
};

const singularizeWord = (word: string): string => {
	const override = singularOverrides[word];
	if (override) return override;
	if (/(?:ss|x|z|ch|sh)es$/.test(word)) return word.slice(0, -2);
	if (/[a-z]ies$/.test(word)) return `${word.slice(0, -3)}y`;
	if (/(?:ss|us|sis|xis)$/.test(word)) return word;
	if (word.endsWith('s')) return word.slice(0, -1);
	return word;
};

export const formatLabel = (format: Pick<RecordSelect, 'title'> | null): string | undefined => {
	if (!format?.title) return undefined;
	const title = format.title.toLowerCase();
	const words = title.split(' ');
	const label =
		singularOverrides[title] ??
		[...words.slice(0, -1), singularizeWord(words[words.length - 1])].join(' ');
	return label === 'fragment' ? undefined : label;
};

export const outgoingLabel = (predicate: PredicateSlug): string => PREDICATES[predicate].name;

export const incomingLabel = (predicate: PredicateSlug): string =>
	PREDICATES[PREDICATES[predicate].inverseSlug].name;
