import {
	PREDICATES,
	type MediaSelect,
	type PredicateSlug,
	type RecordSelect,
	type RecordType
} from '@aias/hozo';
import { resolve } from '$app/paths';

export type RecordFields = Omit<RecordSelect, 'textEmbedding'>;
export type RecordLink = Pick<RecordSelect, 'id' | 'type' | 'title' | 'slug'>;

export interface LinkGroup {
	predicate: PredicateSlug;
	label: string;
	direction: 'outgoing' | 'incoming';
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

export interface IndexEntry extends RecordLink {
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
	artifact: {
		type: 'artifact',
		path: 'artifacts',
		label: 'Artifacts',
		singular: 'Artifact',
		icon: '📝'
	},
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

export const recordPath = (record: Pick<RecordSelect, 'id' | 'title' | 'slug'>) =>
	resolve('/records/[id=id]/[[slug]]', {
		id: String(record.id),
		slug: recordSlug(record) || undefined
	});

export const displayTitle = (record: Pick<RecordSelect, 'title' | 'type'>): string =>
	record.title || sections[record.type].singular;

// Format concepts carry plural titles ("Essays", "Research Papers"); the
// citation line needs the noun for a single record of that format ("An essay
// by …"). Overrides cover irregular plurals and mass nouns whose countable
// singular the suffix rules can't derive ("Poetry" → "A poem by …").
const singularOverrides: Record<string, string> = {
	advice: 'piece of advice',
	automata: 'automaton',
	fiction: 'fiction story',
	media: 'media work',
	memetics: 'meme',
	memoranda: 'memorandum',
	movies: 'movie',
	photography: 'photograph',
	poetry: 'poem',
	prototyping: 'prototype',
	series: 'series',
	summarization: 'summary',
	theses: 'thesis'
};

const singularizeWord = (word: string): string => {
	const override = singularOverrides[word.toLowerCase()];
	if (override) {
		return word.charAt(0) === word.charAt(0).toUpperCase()
			? override.charAt(0).toUpperCase() + override.slice(1)
			: override;
	}
	if (/(?:ss|x|z|ch|sh)es$/.test(word)) return word.slice(0, -2);
	if (/[a-z]ies$/i.test(word)) return `${word.slice(0, -3)}y`;
	if (/(?:ss|us|sis|xis)$/.test(word)) return word;
	if (word.endsWith('s')) return word.slice(0, -1);
	return word;
};

export const formatLabel = (format: Pick<RecordSelect, 'title'> | null): string | undefined => {
	if (!format?.title) return undefined;
	const words = format.title.split(' ');
	return [...words.slice(0, -1), singularizeWord(words[words.length - 1])].join(' ');
};

export const outgoingLabel = (predicate: PredicateSlug): string => PREDICATES[predicate].name;

export const incomingLabel = (predicate: PredicateSlug): string =>
	PREDICATES[PREDICATES[predicate].inverseSlug].name;
