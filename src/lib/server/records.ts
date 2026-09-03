import {
	incomingLabel,
	outgoingLabel,
	recordPreview,
	visualMedia,
	type FeedEntry,
	type IndexEntry,
	type LinkGroup,
	type RecordCard,
	type RecordFields,
	type RecordGroup,
	type RecordLink,
	type RecordPage
} from '#lib/records.js';
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
import { and, cosineDistance, desc, eq, inArray, isNotNull, lte, sql, type SQL } from 'drizzle-orm';
import { alias, type AnyPgColumn } from 'drizzle-orm/pg-core';
import { db } from './db';

const LIST_LIMIT = 100;
const SEARCH_LIMIT = 200;
const ASSOCIATED_LIMIT = 150;
const SIMILAR_LIMIT = 10;
const FEED_LIMIT = 30;

/** Incoming links with these predicates count toward an index entry: an entity's works, a concept's tagged records, the artifacts about a subject. */
const describingPredicates: PredicateSlug[] = [
	'created_by',
	'tagged_with',
	'about',
	'references',
	'responds_to'
];

/** Containment links frame the card: the container and responded-to work attach above the record, quoted works attach below, and incoming sources render beneath as children. */
const containmentPredicates: PredicateSlug[] = ['contained_by', 'quotes'];

/** Predicate/direction pairs the card shape models with dedicated fields. */
const modeledPredicates: Record<LinkGroup['direction'], PredicateSlug[]> = {
	outgoing: [
		'created_by',
		'tagged_with',
		'has_format',
		...containmentPredicates,
		'responds_to',
		'related_to'
	],
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

const isPublic = { isPrivate: false, recordCuratedAt: { isNotNull: true } } as const;

// Anywhere records form a clickable list (search, sections, galleries, link
// chips, the feed) they must also carry a title — the title is what renders as
// the link. Titleless records still appear read-only as children of a parent.
const isListed = { ...isPublic, title: { isNotNull: true } } as const;

const listableRecords = <
	T extends { isPrivate: AnyPgColumn; recordCuratedAt: AnyPgColumn; title: AnyPgColumn }
>(
	table: T
) => and(eq(table.isPrivate, false), isNotNull(table.recordCuratedAt), isNotNull(table.title));

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
	recordCuratedAt: true,
	eloScore: true,
	contentCreatedAt: true,
	recordCreatedAt: true
} as const;

const previewColumns = {
	...linkColumns,
	summary: true,
	content: true,
	mediaCaption: true,
	notes: true
} as const;

const sourceWith = {
	source: {
		columns: previewColumns,
		with: { media: { orderBy: { id: 'asc' } } }
	}
} as const;

const cardWith = {
	media: {
		orderBy: { id: 'asc' }
	},
	outgoingLinks: {
		with: {
			target: {
				columns: previewColumns,
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
		where: { predicate: { in: [...containmentPredicates, 'related_to'] } },
		with: sourceWith
	}
} satisfies RecordsQueryConfig['with'];

const byBest = ((record, { desc: descend }) => [
	descend(record.eloScore),
	descend(sql`coalesce(${record.contentCreatedAt}, ${record.recordCreatedAt})`),
	descend(record.id)
]) satisfies RecordsQueryConfig['orderBy'];

const byChronology = ((record, { asc: ascend }) => [
	ascend(sql`coalesce(${record.contentCreatedAt}, ${record.recordCreatedAt})`),
	ascend(record.id)
]) satisfies RecordsQueryConfig['orderBy'];

type LinkRowRecord = RecordLink &
	Pick<
		RecordFields,
		'isPrivate' | 'recordCuratedAt' | 'eloScore' | 'contentCreatedAt' | 'recordCreatedAt'
	>;

// The relational query can't order nested link rows by their linked record, so
// the chip rows sort here instead — these comparators must match byBest and
// byChronology exactly, or the chips diverge from the full-card lists they
// preview.
const linkDate = (record: LinkRowRecord) =>
	(record.contentCreatedAt ?? record.recordCreatedAt).getTime();
const byBestLink = (a: LinkRowRecord, b: LinkRowRecord) =>
	b.eloScore - a.eloScore || linkDate(b) - linkDate(a) || b.id - a.id;
const byChronologyLink = (a: LinkRowRecord, b: LinkRowRecord) =>
	linkDate(a) - linkDate(b) || a.id - b.id;

type PreviewRow = LinkRowRecord &
	Pick<RecordFields, 'summary' | 'content' | 'mediaCaption' | 'notes'>;

type SourceRow = PreviewRow & { media: MediaSelect[] };

type TargetRow = PreviewRow & { outgoingLinks: { target: LinkRowRecord | null }[] };

interface CardRow extends RecordFields {
	media: MediaSelect[];
	outgoingLinks: {
		id: number;
		predicate: string;
		target: TargetRow | null;
	}[];
	incomingLinks: {
		id: number;
		predicate: string;
		source: SourceRow | null;
	}[];
}

const pickLink = ({ id, type, title, slug }: RecordLink): RecordLink => ({ id, type, title, slug });

const isVisible = <T extends LinkRowRecord>(record: T | null): record is T =>
	record !== null && record.recordCuratedAt !== null && !record.isPrivate;

const isListable = <T extends LinkRowRecord>(record: T | null): record is T =>
	isVisible(record) && record.title !== null;

const dedupeById = <T extends RecordLink>(items: T[]): T[] => {
	const seen = new Set<number>();
	return items.filter((item) => {
		if (seen.has(item.id)) return false;
		seen.add(item.id);
		return true;
	});
};

type LinkRows = Pick<CardRow, 'outgoingLinks' | 'incomingLinks'>;

function linkGroups(row: LinkRows, guard: typeof isListable = isListable): LinkGroup[] {
	const groups = new Map<
		string,
		Pick<LinkGroup, 'predicate' | 'label' | 'direction'> & { rows: LinkRowRecord[] }
	>();
	const addGroup = (
		predicate: PredicateSlug,
		direction: LinkGroup['direction'],
		rows: LinkRowRecord[]
	) => {
		if (rows.length === 0) return;
		const label = direction === 'outgoing' ? outgoingLabel(predicate) : incomingLabel(predicate);
		const group = groups.get(label) ?? { predicate, label, direction, rows: [] };
		group.rows = [...group.rows, ...rows];
		groups.set(label, group);
	};
	for (const predicate of predicateSlugs) {
		if (!isPredicateSlug(predicate)) continue;
		addGroup(
			predicate,
			'outgoing',
			row.outgoingLinks.flatMap((link) =>
				link.predicate === predicate && guard(link.target) ? [link.target] : []
			)
		);
		addGroup(
			predicate,
			'incoming',
			row.incomingLinks.flatMap((link) =>
				link.predicate === predicate && guard(link.source) ? [link.source] : []
			)
		);
	}
	return [...groups.values()].map(({ rows, ...group }) => ({
		...group,
		records: dedupeById(rows.sort(byBestLink).map(pickLink))
	}));
}

function toCard(row: CardRow): RecordCard {
	const { media, outgoingLinks, incomingLinks, ...fields } = row;
	// The nested link rows arrive unordered, and the chip rows they become
	// preview full-card lists, so each relation sorts by the same order as the
	// card query that renders it.
	const targets = (predicate: PredicateSlug): LinkRowRecord[] =>
		outgoingLinks
			.flatMap((link) =>
				link.predicate === predicate && isListable(link.target) ? [link.target] : []
			)
			.sort(byBestLink);
	const sources = (predicate: PredicateSlug, guard: typeof isListable = isListable): SourceRow[] =>
		incomingLinks
			.flatMap((link) => (link.predicate === predicate && guard(link.source) ? [link.source] : []))
			.sort(byBestLink);

	// Quoted and responded-to works keep titleless targets: the attachment's
	// preview lines identify them where a bare link could not.
	const attachmentRows = (predicate: PredicateSlug, guard: typeof isListable = isListable) =>
		dedupeById(
			outgoingLinks
				.flatMap((link) =>
					link.predicate === predicate && guard(link.target) ? [link.target] : []
				)
				.sort(byBestLink)
		);
	const withCreators = (target: TargetRow) => ({
		...pickLink(target),
		creators: target.outgoingLinks.flatMap((nested) =>
			isListable(nested.target) ? [pickLink(nested.target)] : []
		)
	});
	const toAttachment = (target: TargetRow) => ({
		...withCreators(target),
		preview: recordPreview(target)
	});

	const parents = attachmentRows('contained_by').map(withCreators);
	const quoted = attachmentRows('quotes', isVisible).map(toAttachment);
	const respondsTo = attachmentRows('responds_to', isVisible).map(toAttachment);

	// Connections keep the order their links were added in — the earliest links
	// are typically the most relevant.
	const connectionRows = [
		...outgoingLinks.flatMap((link) =>
			link.predicate === 'related_to' && isListable(link.target)
				? [{ linkId: link.id, record: link.target }]
				: []
		),
		...incomingLinks.flatMap((link) =>
			link.predicate === 'related_to' && isListable(link.source)
				? [{ linkId: link.id, record: link.source }]
				: []
		)
	].sort((a, b) => a.linkId - b.linkId);

	const groups = linkGroups(row);
	const groupsOf = (bucket: GroupBucket): LinkGroup[] =>
		groups.filter((group) => bucketFor(group.predicate, group.direction) === bucket);

	// Children double as read-only full-card content, so titleless records
	// stay in the list; the card filters them out of its clickable chips.
	const childRows = dedupeById(
		containmentPredicates
			.flatMap((predicate) => sources(predicate, isVisible))
			.sort(byChronologyLink)
	);
	const containedRows = sources('contained_by', isVisible).sort(byChronologyLink);

	return {
		...fields,
		media,
		creators: targets('created_by').map(pickLink),
		attributions: groupsOf('attributions'),
		tags: targets('tagged_with').map(pickLink),
		format: targets('has_format').map(pickLink)[0] ?? null,
		parents,
		quoted,
		respondsTo,
		children: childRows.map(pickLink),
		childPreview: containedRows.map(recordPreview).find(Boolean) ?? null,
		childMedia: containedRows.flatMap((child) => visualMedia(child.media))[0] ?? null,
		references: groupsOf('references'),
		connections: dedupeById(connectionRows.map(({ record }) => pickLink(record))),
		extras: groupsOf('extras')
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
			incomingLinks: { with: sourceWith }
		}
	});
	if (!row) return null;

	const record = toCard(row);

	if (record.type !== 'artifact') {
		const isArtifact = <T extends LinkRowRecord>(linked: T | null): linked is T =>
			isListable(linked) && linked.type === 'artifact';
		const isPeer = <T extends LinkRowRecord>(linked: T | null): linked is T =>
			isListable(linked) && linked.type !== 'artifact';
		const isSymmetric = (predicate: string) =>
			isPredicateSlug(predicate) && PREDICATES[predicate].inverseSlug === predicate;
		const associatedIds = [
			...new Set([
				...row.incomingLinks.flatMap((link) => (isArtifact(link.source) ? [link.source.id] : [])),
				...row.outgoingLinks.flatMap((link) =>
					isSymmetric(link.predicate) && isArtifact(link.target) ? [link.target.id] : []
				)
			])
		];
		return {
			record,
			references: [],
			children: [],
			relations: linkGroups(row, isPeer),
			associated: await getRecordCards(associatedIds, 'best', ASSOCIATED_LIMIT)
		};
	}

	const referenceIds = [
		...new Set(record.references.flatMap((group) => group.records.map((link) => link.id)))
	];
	const [children, connectionCards, referenceCards] = await Promise.all([
		getRecordCards(
			record.children.map((child) => child.id),
			'chronological'
		),
		getRecordCards(record.connections.map((connection) => connection.id)),
		getRecordCards(referenceIds)
	]);

	// Connection cards keep the card's link-addition order, not the fetch's
	// best-first order.
	const connectionsById = new Map(connectionCards.map((card) => [card.id, card]));
	const connections = record.connections.flatMap(
		(connection) => connectionsById.get(connection.id) ?? []
	);

	// The reference blocks render full cards, so each group's links map onto
	// the fetched cards, keeping the best-first order of the card query.
	// Explicit connections join them as their own labeled group.
	const references = [
		...record.references.flatMap((group) => {
			const ids = new Set(group.records.map((link) => link.id));
			const cards = referenceCards.filter((card) => ids.has(card.id));
			return cards.length > 0 ? [{ label: group.label, records: cards }] : [];
		}),
		...(connections.length > 0
			? [{ label: outgoingLabel('related_to'), records: connections }]
			: [])
	];

	return { record, references, children, relations: [], associated: [] };
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
			type: 'artifact',
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

export async function listArtifactCards(): Promise<RecordCard[]> {
	const ranked = await rankContainmentRoots('recordCuratedAt', LIST_LIMIT);
	if (ranked.length === 0) return [];
	const rows = await db.query.records.findMany({
		where: { id: { in: ranked.map((root) => root.id) }, ...isListed },
		columns: cardColumns,
		with: cardWith
	});
	const cards = new Map(rows.map((row) => [row.id, toCard(row)] as const));
	return ranked.flatMap((root) => {
		const card = cards.get(root.id);
		return card ? [card] : [];
	});
}

async function indexEntriesFor(type: RecordType, limit: number): Promise<IndexEntry[]> {
	const inPredicates = (predicates: PredicateSlug[]) =>
		sql.join(
			predicates.map((predicate) => sql`${predicate}`),
			sql`, `
		);
	// The count is the listable corpus behind an entry: records that describe it
	// directly, plus quotes and children of the works it created — a creator's
	// extracts attach to the work, not the creator.
	const corpusCount = sql<number>`(
		SELECT count(DISTINCT contributor.source_id)::int
		FROM (
			SELECT described.source_id FROM ${links} described
			WHERE described.target_id = ${records}.id
				AND described.predicate IN (${inPredicates(describingPredicates)})
			UNION
			SELECT child.source_id FROM ${links} child
			JOIN ${links} work ON work.source_id = child.target_id
				AND work.predicate = 'created_by' AND work.target_id = ${records}.id
			WHERE child.predicate IN (${inPredicates(containmentPredicates)})
		) contributor
		WHERE EXISTS (
			SELECT 1 FROM ${records} source
			WHERE source.id = contributor.source_id
				AND source.is_private = false AND source.curated_at IS NOT NULL AND source.title IS NOT NULL
		)
	)`;
	return db
		.select({
			id: records.id,
			title: records.title,
			slug: records.slug,
			type: records.type,
			count: corpusCount
		})
		.from(records)
		.where(and(eq(records.type, type), listableRecords(records)))
		.orderBy(
			desc(records.eloScore),
			desc(sql`coalesce(${records.contentCreatedAt}, ${records.recordCreatedAt})`),
			desc(records.id)
		)
		.limit(limit);
}

export async function getIndexEntries(): Promise<IndexEntry[]> {
	const [entities, concepts] = await Promise.all([
		indexEntriesFor('entity', LIST_LIMIT),
		indexEntriesFor('concept', LIST_LIMIT)
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
				rank: sql<number>`row_number() over (partition by ${links.targetId} order by ${source.eloScore} desc, ${source.recordUpdatedAt} desc)`.as(
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

export async function listRecordGroups(type: RecordType): Promise<RecordGroup[]> {
	const entries = await indexEntriesFor(type, LIST_LIMIT);
	const tops = await topRecordsFor(entries.map((entry) => entry.id));
	return entries.map((entry) => ({ ...entry, top: tops.get(entry.id) ?? [] }));
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

interface ContainmentRoot {
	id: number;
	recency: number;
	descendantIds: Set<number>;
}

/**
 * The unit of the feed and the artifacts list is a containment root: a listed
 * artifact with no listed artifact above it in the visible containment graph.
 * Each root carries its whole visible descendant tree, and a new descendant
 * anywhere in the tree resurfaces the root, so the graph loads whole — roots,
 * exclusions, and recency all come from one traversal.
 */
async function rankContainmentRoots(
	recencyColumn: 'recordCreatedAt' | 'recordCuratedAt',
	limit: number
): Promise<ContainmentRoot[]> {
	const recencyOf = (record: Pick<RecordFields, 'recordCreatedAt' | 'recordCuratedAt'>) =>
		(record[recencyColumn] ?? record.recordCreatedAt).getTime();
	const containmentLinks = await db.query.links.findMany({
		where: { predicate: { in: containmentPredicates } },
		columns: { id: true },
		with: { source: { columns: linkColumns }, target: { columns: linkColumns } }
	});

	const nodes = new Map<number, LinkRowRecord>();
	const parentIds = new Map<number, number[]>();
	const childIds = new Map<number, number[]>();
	const connect = (edges: Map<number, number[]>, from: number, to: number) => {
		const list = edges.get(from);
		if (list) list.push(to);
		else edges.set(from, [to]);
	};
	for (const { source, target } of containmentLinks) {
		if (!isVisible(source) || !isVisible(target)) continue;
		nodes.set(source.id, source);
		nodes.set(target.id, target);
		connect(parentIds, source.id, target.id);
		connect(childIds, target.id, source.id);
	}

	const listedArtifact = (record: LinkRowRecord) =>
		isListable(record) && record.type === 'artifact';
	const traverse = (startId: number, edges: Map<number, number[]>) => {
		const seen = new Set<number>();
		const stack = [...(edges.get(startId) ?? [])];
		for (let currentId = stack.pop(); currentId !== undefined; currentId = stack.pop()) {
			if (seen.has(currentId) || currentId === startId) continue;
			seen.add(currentId);
			stack.push(...(edges.get(currentId) ?? []));
		}
		return seen;
	};

	const roots = [...nodes.values()].filter(
		(node) =>
			listedArtifact(node) &&
			![...traverse(node.id, parentIds)].some((ancestorId) => {
				const ancestor = nodes.get(ancestorId);
				return ancestor !== undefined && listedArtifact(ancestor);
			})
	);
	const treeCandidates = roots.map((root) => {
		const descendantIds = traverse(root.id, childIds);
		const recency = Math.max(
			recencyOf(root),
			...[...descendantIds].flatMap((id) => {
				const node = nodes.get(id);
				return node ? [recencyOf(node)] : [];
			})
		);
		return { id: root.id, recency, descendantIds };
	});

	// Every listed artifact in the graph either roots one of the tree candidates
	// or renders inside one, so the standalone scan covers only records outside
	// the graph.
	const graphListedIds = [...nodes.values()].filter(listedArtifact).map((node) => node.id);
	const standaloneRows = await db.query.records.findMany({
		where: {
			type: 'artifact',
			...isListed,
			...(graphListedIds.length > 0 ? { id: { notIn: graphListedIds } } : {})
		},
		columns: { id: true, recordCreatedAt: true, recordCuratedAt: true },
		orderBy: (record, { desc: descend }) => [descend(record[recencyColumn]), descend(record.id)],
		limit
	});

	return [
		...treeCandidates,
		...standaloneRows.map((row) => ({
			id: row.id,
			recency: recencyOf(row),
			descendantIds: new Set<number>()
		}))
	]
		.sort((a, b) => b.recency - a.recency || b.id - a.id)
		.slice(0, limit);
}

export async function getFeedEntries(): Promise<FeedEntry[]> {
	const ranked = await rankContainmentRoots('recordCreatedAt', FEED_LIMIT);
	if (ranked.length === 0) return [];

	const cardIds = [...new Set(ranked.flatMap((entry) => [entry.id, ...entry.descendantIds]))];
	const rows = await db.query.records.findMany({
		where: { id: { in: cardIds }, ...isPublic },
		columns: cardColumns,
		with: cardWith
	});
	const cards = new Map(rows.map((row) => [row.id, toCard(row)] as const));

	const toEntry = (card: RecordCard, path: Set<number>): FeedEntry => ({
		record: card,
		children: card.children.flatMap((child) => {
			const childCard = path.has(child.id) ? undefined : cards.get(child.id);
			return childCard ? [toEntry(childCard, new Set([...path, child.id]))] : [];
		})
	});
	return ranked.flatMap((candidate) => {
		const card = cards.get(candidate.id);
		return card ? [toEntry(card, new Set([candidate.id]))] : [];
	});
}
