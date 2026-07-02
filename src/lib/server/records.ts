import {
	isPredicateSlug,
	links,
	records,
	type MediaSelect,
	type PredicateSlug,
	type RecordType
} from '@aias/hozo';
import { and, count, desc, eq, exists, inArray, lte, sql } from 'drizzle-orm';
import { alias, type AnyPgColumn } from 'drizzle-orm/pg-core';
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
import { db } from './db';

export const PAGE_SIZE = 100;
const SEARCH_LIMIT = 200;
const ASSOCIATED_LIMIT = 150;
const FEED_LIMIT = 30;

/** Incoming links with these predicates define what a record collects: an entity's works, a concept's tagged records. */
const describingPredicates: PredicateSlug[] = ['created_by', 'tagged_with', 'about'];

/** Predicates the card shape models explicitly; everything else lands in `extras`. */
const handledPredicates: PredicateSlug[] = [
	'created_by',
	'tagged_with',
	'has_format',
	'contained_by',
	'related_to'
];

const isPublic = { isPrivate: false, isCurated: true } as const;

const publicRecords = <T extends { isPrivate: AnyPgColumn; isCurated: AnyPgColumn }>(table: T) =>
	and(eq(table.isPrivate, false), eq(table.isCurated, true));

type RecordsQueryConfig = NonNullable<Parameters<typeof db.query.records.findMany>[0]>;

const cardColumns = { textEmbedding: false } satisfies RecordsQueryConfig['columns'];

const linkColumns = { id: true, type: true, title: true, slug: true } as const;

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

interface CardRow extends RecordFields {
	media: MediaSelect[];
	outgoingLinks: {
		predicate: string;
		target: (RecordLink & { outgoingLinks: { target: RecordLink | null }[] }) | null;
	}[];
	incomingLinks: {
		predicate: string;
		source: RecordLink | null;
	}[];
}

const pickLink = ({ id, type, title, slug }: RecordLink): RecordLink => ({ id, type, title, slug });

function toCard(row: CardRow): RecordCard {
	const { media, outgoingLinks, incomingLinks, ...fields } = row;
	const targets = (predicate: PredicateSlug): RecordLink[] =>
		outgoingLinks.flatMap((link) =>
			link.predicate === predicate && link.target ? [pickLink(link.target)] : []
		);
	const sources = (predicate: PredicateSlug): RecordLink[] =>
		incomingLinks.flatMap((link) =>
			link.predicate === predicate && link.source ? [pickLink(link.source)] : []
		);

	const parentTarget =
		outgoingLinks.find((link) => link.predicate === 'contained_by')?.target ?? null;
	const parent = parentTarget
		? {
				...pickLink(parentTarget),
				creators: parentTarget.outgoingLinks.flatMap((link) =>
					link.target ? [pickLink(link.target)] : []
				)
			}
		: null;

	const extras: LinkGroup[] = [];
	for (const predicate of new Set(outgoingLinks.map((link) => link.predicate))) {
		if (!isPredicateSlug(predicate) || handledPredicates.includes(predicate)) continue;
		extras.push({ predicate, label: outgoingLabel(predicate), records: targets(predicate) });
	}
	for (const predicate of new Set(incomingLinks.map((link) => link.predicate))) {
		if (!isPredicateSlug(predicate)) continue;
		if (handledPredicates.includes(predicate) || describingPredicates.includes(predicate)) continue;
		extras.push({ predicate, label: incomingLabel(predicate), records: sources(predicate) });
	}

	return {
		...fields,
		media,
		creators: targets('created_by'),
		tags: targets('tagged_with'),
		format: targets('has_format')[0] ?? null,
		parent,
		children: sources('contained_by'),
		connections: [...targets('related_to'), ...sources('related_to')],
		extras
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
					predicate: { in: ['contained_by', 'related_to', 'quotes', ...describingPredicates] }
				},
				with: { source: { columns: linkColumns } }
			}
		}
	});
	if (!row) return null;

	const record = toCard(row);
	const associatedIds = [
		...new Set(
			row.incomingLinks.flatMap((link) =>
				isPredicateSlug(link.predicate) &&
				describingPredicates.includes(link.predicate) &&
				link.source
					? [link.source.id]
					: []
			)
		)
	];
	const [children, connections, associated] = await Promise.all([
		getRecordCards(
			record.children.map((child) => child.id),
			'chronological'
		),
		getRecordCards(record.connections.map((connection) => connection.id)),
		getRecordCards(associatedIds, 'best', ASSOCIATED_LIMIT)
	]);

	return { record, children, connections, associated };
}

export async function listRecordCards(
	type: RecordType,
	page: number
): Promise<{ cards: RecordCard[]; total: number }> {
	const [rows, total] = await Promise.all([
		db.query.records.findMany({
			where: { type, ...isPublic },
			columns: cardColumns,
			with: cardWith,
			orderBy: byBest,
			limit: PAGE_SIZE,
			offset: (page - 1) * PAGE_SIZE
		}),
		db.$count(records, and(eq(records.type, type), publicRecords(records)))
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
						.where(and(eq(source.id, links.sourceId), publicRecords(source)))
				)
			)
		)
		.where(and(eq(records.type, type), publicRecords(records)))
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
			.innerJoin(source, and(eq(source.id, links.sourceId), publicRecords(source)))
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
		db.$count(records, and(eq(records.type, type), publicRecords(records)))
	]);
	const tops = await topRecordsFor(entries.map((entry) => entry.id));
	return {
		groups: entries.map((entry) => ({ ...entry, top: tops.get(entry.id) ?? [] })),
		total
	};
}

export async function searchRecords(query: string, type?: RecordType): Promise<RecordCard[]> {
	const pattern = `%${query.replace(/[\\%_]/g, '\\$&')}%`;
	const rows = await db.query.records.findMany({
		where: {
			...isPublic,
			...(type ? { type } : {}),
			OR: [
				{ title: { ilike: pattern } },
				{ content: { ilike: pattern } },
				{ summary: { ilike: pattern } },
				{ abbreviation: { ilike: pattern } }
			]
		},
		columns: cardColumns,
		with: cardWith,
		orderBy: byBest,
		limit: SEARCH_LIMIT
	});
	return rows.map(toCard);
}

export async function getFeedEntries(): Promise<FeedEntry[]> {
	const rows = await db.query.records.findMany({
		where: { type: 'artifact', ...isPublic },
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
