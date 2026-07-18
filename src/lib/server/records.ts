import {
	incomingLabel,
	outgoingLabel,
	type FeedEntry,
	type IndexEntry,
	type LinkGroup,
	type RecordCard,
	type RecordFields,
	type RecordGroup,
	type RecordLink,
	type RecordPage
} from '$lib/records';
import {
	isPredicateSlug,
	links,
	PREDICATES,
	predicateSlugs,
	records,
	type MediaSelect,
	type PredicateSlug,
	type RecordType
} from '@aias/hozo';
import {
	and,
	cosineDistance,
	count,
	desc,
	eq,
	exists,
	inArray,
	isNotNull,
	lte,
	sql,
	type SQL
} from 'drizzle-orm';
import { alias, type AnyPgColumn } from 'drizzle-orm/pg-core';
import { db } from './db';

export const PAGE_SIZE = 100;
const SEARCH_LIMIT = 200;
const ASSOCIATED_LIMIT = 150;
const SIMILAR_LIMIT = 10;
const FEED_LIMIT = 30;

/** Incoming links with these predicates define what a record collects: an entity's works, a concept's tagged records, the artifacts about a subject. */
const describingPredicates: PredicateSlug[] = [
	'created_by',
	'tagged_with',
	'about',
	'references',
	'responds_to'
];

/** Containment links frame the card: outgoing targets (the container, the quoted work) render above the record, incoming sources render below as children. */
const containmentPredicates: PredicateSlug[] = ['contained_by', 'quotes'];

/** Predicate/direction pairs the card shape models with dedicated fields. */
const modeledPredicates: Record<LinkGroup['direction'], PredicateSlug[]> = {
	outgoing: ['created_by', 'tagged_with', 'has_format', ...containmentPredicates, 'related_to'],
	incoming: [...containmentPredicates, 'related_to']
};

type GroupBucket = 'attributions' | 'references' | 'extras';

/**
 * Every remaining predicate places by its type: creation attributes the record
 * in its citation line, reference and identity render as relation rows above
 * the children, and inverse views without a dedicated home (creator of, tag
 * of, countered by, …) render as rows at the bottom of the card.
 */
const bucketFor = (
	predicate: PredicateSlug,
	direction: LinkGroup['direction']
): GroupBucket | null => {
	if (modeledPredicates[direction].includes(predicate)) return null;
	const { type } = PREDICATES[predicate];
	if (type === 'reference' || type === 'identity') return 'references';
	if (type === 'creation' && direction === 'outgoing') return 'attributions';
	return 'extras';
};

const isPublic = { isPrivate: false, isCurated: true } as const;

// Anywhere records form a clickable list (search, sections, galleries, link
// chips, the feed) they must also carry a title — the title is what renders as
// the link. Titleless records still appear read-only as children of a parent.
const isListed = { ...isPublic, title: { isNotNull: true } } as const;

const listableRecords = <
	T extends { isPrivate: AnyPgColumn; isCurated: AnyPgColumn; title: AnyPgColumn }
>(
	table: T
) => and(eq(table.isPrivate, false), eq(table.isCurated, true), isNotNull(table.title));

type RecordsQueryConfig = NonNullable<Parameters<typeof db.query.records.findMany>[0]>;

const cardColumns = {
	textEmbedding: false,
	textSearch: false
} satisfies RecordsQueryConfig['columns'];

const linkColumns = {
	id: true,
	type: true,
	title: true,
	slug: true,
	isPrivate: true,
	isCurated: true
} as const;

const cardWith = {
	media: {
		orderBy: { id: 'asc' }
	},
	outgoingLinks: {
		with: {
			target: {
				columns: linkColumns,
				with: {
					outgoingLinks: {
						where: { predicate: 'created_by' },
						with: { target: { columns: linkColumns } }
					}
				}
			}
		}
	},
	incomingLinks: {
		where: { predicate: { in: ['contained_by', 'related_to'] } },
		with: { source: { columns: linkColumns } }
	}
} satisfies RecordsQueryConfig['with'];

const byBest = ((record, { desc: descend }) => [
	descend(record.eloScore),
	descend(record.rating),
	descend(sql`coalesce(${record.contentCreatedAt}, ${record.recordCreatedAt})`)
]) satisfies RecordsQueryConfig['orderBy'];

const byChronology = ((record, { asc: ascend }) => [
	ascend(sql`coalesce(${record.contentCreatedAt}, ${record.recordCreatedAt})`),
	ascend(record.id)
]) satisfies RecordsQueryConfig['orderBy'];

const byRecency = ((record, { desc: descend }) => [
	descend(sql`coalesce(${record.contentCreatedAt}, ${record.recordCreatedAt})`),
	descend(record.id)
]) satisfies RecordsQueryConfig['orderBy'];

type LinkRowRecord = RecordLink & Pick<RecordFields, 'isPrivate' | 'isCurated'>;

interface CardRow extends RecordFields {
	media: MediaSelect[];
	outgoingLinks: {
		predicate: string;
		target: (LinkRowRecord & { outgoingLinks: { target: LinkRowRecord | null }[] }) | null;
	}[];
	incomingLinks: {
		predicate: string;
		source: LinkRowRecord | null;
	}[];
}

const pickLink = ({ id, type, title, slug }: RecordLink): RecordLink => ({ id, type, title, slug });

const isVisible = (record: LinkRowRecord | null): record is LinkRowRecord =>
	record?.isCurated === true && !record.isPrivate;

const isListable = (record: LinkRowRecord | null): record is LinkRowRecord =>
	isVisible(record) && record.title !== null;

const dedupeById = <T extends RecordLink>(items: T[]): T[] => {
	const seen = new Set<number>();
	return items.filter((item) => {
		if (seen.has(item.id)) return false;
		seen.add(item.id);
		return true;
	});
};

function toCard(row: CardRow): RecordCard {
	const { media, outgoingLinks, incomingLinks, ...fields } = row;
	const targets = (predicate: PredicateSlug): RecordLink[] =>
		outgoingLinks.flatMap((link) =>
			link.predicate === predicate && isListable(link.target) ? [pickLink(link.target)] : []
		);
	const sources = (predicate: PredicateSlug, guard: typeof isListable = isListable): RecordLink[] =>
		incomingLinks.flatMap((link) =>
			link.predicate === predicate && guard(link.source) ? [pickLink(link.source)] : []
		);

	const parents = dedupeById(
		containmentPredicates.flatMap((predicate) =>
			outgoingLinks.flatMap((link) =>
				link.predicate === predicate && isListable(link.target)
					? [
							{
								...pickLink(link.target),
								creators: link.target.outgoingLinks.flatMap((nested) =>
									isListable(nested.target) ? [pickLink(nested.target)] : []
								)
							}
						]
					: []
			)
		)
	);

	// Self-inverse predicates share a label across directions, so grouping by
	// label merges them into one deduplicated list.
	const buckets: Record<GroupBucket, Map<string, LinkGroup>> = {
		attributions: new Map(),
		references: new Map(),
		extras: new Map()
	};
	const addGroup = (
		predicate: PredicateSlug,
		direction: LinkGroup['direction'],
		records: RecordLink[]
	) => {
		if (records.length === 0) return;
		const bucket = bucketFor(predicate, direction);
		if (!bucket) return;
		const label = direction === 'outgoing' ? outgoingLabel(predicate) : incomingLabel(predicate);
		const group = buckets[bucket].get(label) ?? { predicate, label, direction, records: [] };
		group.records = dedupeById([...group.records, ...records]);
		buckets[bucket].set(label, group);
	};
	// Declaration order in PREDICATES keeps citation phrases and relation rows stable.
	for (const predicate of predicateSlugs) {
		if (!isPredicateSlug(predicate)) continue;
		addGroup(predicate, 'outgoing', targets(predicate));
		addGroup(predicate, 'incoming', sources(predicate));
	}

	return {
		...fields,
		media,
		creators: targets('created_by'),
		attributions: [...buckets.attributions.values()],
		tags: targets('tagged_with'),
		format: targets('has_format')[0] ?? null,
		parents,
		// Children double as read-only full-card content, so titleless records
		// stay in the list; the card filters them out of its clickable chips.
		children: dedupeById(
			containmentPredicates.flatMap((predicate) => sources(predicate, isVisible))
		),
		references: [...buckets.references.values()],
		connections: dedupeById([...targets('related_to'), ...sources('related_to')]),
		extras: [...buckets.extras.values()]
	};
}

export async function getRecordCards(
	ids: number[],
	order: 'best' | 'chronological' = 'best',
	limit?: number
): Promise<RecordCard[]> {
	if (ids.length === 0) return [];
	const rows = await db.query.records.findMany({
		where: { id: { in: ids }, ...isPublic },
		columns: cardColumns,
		with: cardWith,
		orderBy: order === 'best' ? byBest : byChronology,
		limit
	});
	return rows.map(toCard);
}

export async function getRecordPage(id: number): Promise<RecordPage | null> {
	const row = await db.query.records.findFirst({
		where: { id, ...isPublic },
		columns: cardColumns,
		with: {
			...cardWith,
			incomingLinks: {
				where: {
					predicate: {
						in: [...containmentPredicates, 'related_to', 'same_as', ...describingPredicates]
					}
				},
				with: { source: { columns: linkColumns } }
			}
		}
	});
	if (!row) return null;

	const record = toCard(row);

	// Entity and concept pages render their describing incoming links (works by
	// an entity, records tagged with a concept) as a full-card gallery; artifact
	// pages keep them as labeled link rows on the card instead.
	const collectsRecords = record.type !== 'artifact';
	const associatedIds = collectsRecords
		? [
				...new Set(
					row.incomingLinks.flatMap((link) =>
						isPredicateSlug(link.predicate) &&
						describingPredicates.includes(link.predicate) &&
						isListable(link.source)
							? [link.source.id]
							: []
					)
				)
			]
		: [];
	const stripDescribing = (groups: LinkGroup[]): LinkGroup[] =>
		groups.filter(
			(group) => !(group.direction === 'incoming' && describingPredicates.includes(group.predicate))
		);
	const referenceLinks = collectsRecords ? stripDescribing(record.references) : record.references;
	const referenceIds = [
		...new Set(referenceLinks.flatMap((group) => group.records.map((link) => link.id)))
	];

	const [children, connections, associated, referenceCards] = await Promise.all([
		getRecordCards(
			record.children.map((child) => child.id),
			'chronological'
		),
		getRecordCards(record.connections.map((connection) => connection.id)),
		getRecordCards(associatedIds, 'best', ASSOCIATED_LIMIT),
		getRecordCards(referenceIds)
	]);

	// The reference blocks render full cards, so each group's links map onto
	// the fetched cards, keeping the best-first order of the card query.
	const references = referenceLinks.flatMap((group) => {
		const ids = new Set(group.records.map((link) => link.id));
		const cards = referenceCards.filter((card) => ids.has(card.id));
		return cards.length > 0 ? [{ label: group.label, records: cards }] : [];
	});

	return {
		record: collectsRecords
			? { ...record, references: referenceLinks, extras: stripDescribing(record.extras) }
			: record,
		references,
		children,
		connections,
		associated
	};
}

export async function getSimilarRecords(id: number): Promise<RecordCard[]> {
	const record = await db.query.records.findFirst({
		where: { id, ...isPublic },
		columns: { textEmbedding: true },
		with: {
			outgoingLinks: { columns: { predicate: true, targetId: true } },
			incomingLinks: { columns: { sourceId: true } }
		}
	});
	const embedding = record?.textEmbedding;
	if (!embedding) return [];

	// Semantic neighbors complement the explicit graph, so anything already
	// linked (in either direction) is excluded along with the record itself.
	// Siblings go too: they always score high but are better read together by
	// opening the parent, and they crowd out farther-flung relations.
	const linkedIds = [
		id,
		...record.outgoingLinks.map((link) => link.targetId),
		...record.incomingLinks.map((link) => link.sourceId)
	];
	const parentIds = record.outgoingLinks.flatMap((link) =>
		link.predicate === 'contained_by' ? [link.targetId] : []
	);
	const rows = await db.query.records.findMany({
		where: {
			...isListed,
			id: { notIn: linkedIds },
			textEmbedding: { isNotNull: true },
			...(parentIds.length > 0
				? { NOT: { outgoingLinks: { predicate: 'contained_by', targetId: { in: parentIds } } } }
				: {})
		},
		columns: cardColumns,
		with: cardWith,
		orderBy: (table) => [cosineDistance(table.textEmbedding, embedding)],
		limit: SIMILAR_LIMIT
	});
	return rows.map(toCard);
}

export async function listRecordCards(
	type: RecordType,
	page: number
): Promise<{ cards: RecordCard[]; total: number }> {
	const [rows, total] = await Promise.all([
		db.query.records.findMany({
			where: { type, ...isListed },
			columns: cardColumns,
			with: cardWith,
			orderBy: byBest,
			limit: PAGE_SIZE,
			offset: (page - 1) * PAGE_SIZE
		}),
		db.$count(records, and(eq(records.type, type), listableRecords(records)))
	]);
	return { cards: rows.map(toCard), total };
}

async function indexEntriesFor(type: RecordType, limit: number, offset = 0): Promise<IndexEntry[]> {
	const source = alias(records, 'source');
	return db
		.select({
			id: records.id,
			title: records.title,
			slug: records.slug,
			type: records.type,
			count: count(links.id)
		})
		.from(records)
		.leftJoin(
			links,
			and(
				eq(links.targetId, records.id),
				inArray(links.predicate, describingPredicates),
				exists(
					db
						.select({ present: sql`1` })
						.from(source)
						.where(and(eq(source.id, links.sourceId), listableRecords(source)))
				)
			)
		)
		.where(and(eq(records.type, type), listableRecords(records)))
		.groupBy(records.id)
		.orderBy(
			desc(records.eloScore),
			desc(records.rating),
			desc(sql`coalesce(${records.contentCreatedAt}, ${records.recordCreatedAt})`)
		)
		.limit(limit)
		.offset(offset);
}

export async function getIndexEntries(): Promise<IndexEntry[]> {
	const [entities, concepts] = await Promise.all([
		indexEntriesFor('entity', PAGE_SIZE),
		indexEntriesFor('concept', PAGE_SIZE)
	]);
	return [...entities, ...concepts];
}

async function topRecordsFor(targetIds: number[]): Promise<Map<number, RecordLink[]>> {
	const tops = new Map<number, RecordLink[]>();
	if (targetIds.length === 0) return tops;
	const source = alias(records, 'source');
	const ranked = db.$with('ranked').as(
		db
			.select({
				targetId: links.targetId,
				id: source.id,
				type: source.type,
				title: source.title,
				slug: source.slug,
				rank: sql<number>`row_number() over (partition by ${links.targetId} order by ${source.eloScore} desc, ${source.rating} desc)`.as(
					'rank'
				)
			})
			.from(links)
			.innerJoin(source, and(eq(source.id, links.sourceId), listableRecords(source)))
			.where(
				and(inArray(links.targetId, targetIds), inArray(links.predicate, describingPredicates))
			)
	);
	const rows = await db.with(ranked).select().from(ranked).where(lte(ranked.rank, 5));
	for (const { targetId, id, type, title, slug } of rows) {
		const list = tops.get(targetId) ?? [];
		list.push({ id, type, title, slug });
		tops.set(targetId, list);
	}
	return tops;
}

export async function listRecordGroups(
	type: RecordType,
	page: number
): Promise<{ groups: RecordGroup[]; total: number }> {
	const [entries, total] = await Promise.all([
		indexEntriesFor(type, PAGE_SIZE, (page - 1) * PAGE_SIZE),
		db.$count(records, and(eq(records.type, type), listableRecords(records)))
	]);
	const tops = await topRecordsFor(entries.map((entry) => entry.id));
	return {
		groups: entries.map((entry) => ({ ...entry, top: tops.get(entry.id) ?? [] })),
		total
	};
}

const escapeLike = (query: string) => query.replace(/[\\%_]/g, '\\$&');

/**
 * Build a tsquery from user input: websearch syntax for whole words, OR'd
 * with a per-word prefix query so partially typed words still match.
 */
const toTsQuery = (query: string): SQL => {
	const prefix = query
		.trim()
		.split(/\s+/)
		.map((word) => word.replace(/[^\p{L}\p{N}]/gu, ''))
		.filter(Boolean)
		.map((word) => `${word}:*`)
		.join(' & ');
	return prefix.length > 0
		? sql`(websearch_to_tsquery('english', ${query}) || to_tsquery('english', ${prefix}))`
		: sql`websearch_to_tsquery('english', ${query})`;
};

/**
 * Tiered exactness for ranking: 0 = exact title/abbreviation match, 1 = title
 * prefix, 2 = title/abbreviation substring, 3 = everything else. Keeps literal
 * matches ahead of relevance-ranked and fuzzier ones.
 */
const exactMatchTier = (
	record: { title: AnyPgColumn; abbreviation: AnyPgColumn },
	query: string
): SQL<number> => {
	const escaped = escapeLike(query.trim());
	return sql<number>`CASE
		WHEN lower(${record.title}) = lower(${query}) OR lower(${record.abbreviation}) = lower(${query}) THEN 0
		WHEN ${record.title} ILIKE ${`${escaped}%`} THEN 1
		WHEN ${record.title} ILIKE ${`%${escaped}%`} OR ${record.abbreviation} ILIKE ${`%${escaped}%`} THEN 2
		ELSE 3
	END`;
};

export async function searchRecords(query: string, type?: RecordType): Promise<RecordCard[]> {
	const substring = `%${escapeLike(query)}%`;
	const rows = await db.query.records.findMany({
		where: {
			...isListed,
			...(type ? { type } : {}),
			// The weighted search document matches whole words anywhere (including
			// long content, where trigram similarity vanishes); ILIKE keeps the
			// old mid-word substring matches working.
			RAW: (record) => sql`(
				${record.textSearch} @@ ${toTsQuery(query)} OR
				${record.title} ILIKE ${substring} OR
				${record.abbreviation} ILIKE ${substring} OR
				${record.content} ILIKE ${substring} OR
				${record.summary} ILIKE ${substring}
			)`
		},
		columns: cardColumns,
		with: cardWith,
		orderBy: (record, operators) => [
			exactMatchTier(record, query),
			operators.desc(sql`ts_rank_cd(${record.textSearch}, ${toTsQuery(query)})`),
			...byBest(record, operators)
		],
		limit: SEARCH_LIMIT
	});
	return rows.map(toCard);
}

export async function getFeedEntries(): Promise<FeedEntry[]> {
	const rows = await db.query.records.findMany({
		where: { type: 'artifact', ...isListed },
		columns: cardColumns,
		with: cardWith,
		orderBy: byRecency,
		limit: FEED_LIMIT
	});
	const entries = rows.map(toCard);
	const childIds = [
		...new Set(entries.flatMap((entry) => entry.children.map((child) => child.id)))
	];
	const childCards = new Map(
		(await getRecordCards(childIds, 'chronological')).map((card) => [card.id, card])
	);
	return entries.map((record) => ({
		record,
		children: record.children.flatMap((child) => {
			const card = childCards.get(child.id);
			return card ? [card] : [];
		})
	}));
}
