import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { DatabaseSync } from 'node:sqlite';
import { test } from 'node:test';
import { compileFunction } from 'node:vm';
import { isPredicateSlug, PREDICATES, predicateSlugs } from '@aias/hozo';

const serverSource = readFileSync(
	new URL('../../src/lib/server/records.ts', import.meta.url),
	'utf8'
);
const publicSource = readFileSync(new URL('../../src/lib/records.ts', import.meta.url), 'utf8');
const PUBLIC_FIELDS = [
	'id',
	'type',
	'title',
	'slug',
	'abbreviation',
	'sense',
	'summary',
	'content',
	'mediaCaption',
	'notes',
	'url',
	'avatarUrl',
	'contentCreatedAt',
	'contentUpdatedAt',
	'recordCreatedAt',
	'recordUpdatedAt'
];
const MEDIA_FIELDS = [
	'id',
	'type',
	'url',
	'altText',
	'width',
	'height',
	'contentTypeString',
	'fileSize'
];
const PREVIEW_MEDIA_FIELDS = ['type', 'url', 'altText'];
const CARD_RELATIONS = [
	'media',
	'creators',
	'attributions',
	'tags',
	'format',
	'parents',
	'quoted',
	'respondsTo',
	'children',
	'childPreview',
	'childMedia',
	'references',
	'connections',
	'extras'
];
const INTERNAL_FIELDS = [
	'formatId',
	'isPrivate',
	'recordCuratedAt',
	'eloScore',
	'reminderAt',
	'sources',
	'textEmbedding',
	'textSearch',
	'textEmbeddedAt',
	'futurePrivateField'
];
const LINK_FIELDS = ['id', 'type', 'title', 'slug'];
const sortedKeys = (value) => Object.keys(value).sort();
const ids = (values) => values.map((value) => value.id);

function evaluate(source, imports, exports) {
	const code = stripTypeScriptTypes(source).replace(/^export\s+/gm, '');
	return compileFunction(
		`${code}\nreturn { ${exports.join(', ')} };`,
		Object.keys(imports)
	)(...Object.values(imports));
}

const icons = Object.fromEntries(
	[
		'ArrowLeftRightIcon',
		'ArrowRightIcon',
		'AtSignIcon',
		'CircleDotIcon',
		'CornerDownRightIcon',
		'EqualIcon',
		'FileTextIcon',
		'HashIcon',
		'LightbulbIcon',
		'PenLineIcon',
		'ReplyIcon',
		'UserIcon'
	].map((name) => [name, name])
);
const publicHelpers = evaluate(
	publicSource.slice(publicSource.indexOf('export type ')),
	{
		PREDICATES,
		...icons,
		capitalize: (value) => value[0].toUpperCase() + value.slice(1),
		resolve: () => {
			throw new Error('Unexpected route generation');
		}
	},
	['recordPreview', 'visualMedia', 'outgoingLabel', 'incomingLabel']
);

class SQLFragment {
	constructor(text, params = []) {
		this.text = text;
		this.params = params;
	}
	as() {
		return this;
	}
}
function sql(strings, ...values) {
	let text = strings[0];
	const params = [];
	values.forEach((value, index) => {
		if (value instanceof SQLFragment) {
			text += value.text;
			params.push(...value.params);
		} else {
			text += '?';
			params.push(value);
		}
		text += strings[index + 1];
	});
	return new SQLFragment(text, params);
}
sql.join = (fragments, separator = new SQLFragment(', ')) =>
	new SQLFragment(
		fragments.map((fragment) => fragment.text).join(separator.text),
		fragments.flatMap((fragment, index) =>
			index === 0 ? fragment.params : [...separator.params, ...fragment.params]
		)
	);
const columnNames = {
	isPrivate: 'is_private',
	recordCuratedAt: 'curated_at',
	sourceId: 'source_id',
	targetId: 'target_id',
	eloScore: 'elo_score',
	contentCreatedAt: 'content_created_at',
	recordCreatedAt: 'created_at'
};
function table(name) {
	return new Proxy(new SQLFragment(name), {
		get(target, key) {
			return key in target ? target[key] : new SQLFragment(`${name}.${columnNames[key] ?? key}`);
		}
	});
}
const comparison = (operator) => (left, right) =>
	sql`${left} ${new SQLFragment(operator)} ${right}`;
const desc = (value) => sql`${value} DESC`;
const asc = (value) => sql`${value} ASC`;

function loadServer({ many = [], first = null, linkRows = [] } = {}) {
	const calls = [];
	const db = {
		query: {
			records: {
				findMany: async (config) => {
					calls.push({ operation: 'findMany', config });
					return typeof many === 'function' ? many(config, calls) : many;
				},
				findFirst: async (config) => {
					calls.push({ operation: 'findFirst', config });
					return typeof first === 'function' ? first(config) : first;
				}
			},
			links: {
				findMany: async (config) => {
					calls.push({ operation: 'links', config });
					return linkRows;
				}
			}
		},
		select(selection) {
			calls.push({ operation: 'select', selection });
			const chain = {
				from: () => chain,
				where: () => chain,
				orderBy: () => chain,
				limit: async () => []
			};
			return chain;
		}
	};
	const exports = evaluate(
		serverSource.slice(serverSource.indexOf('const LIST_LIMIT')),
		{
			...publicHelpers,
			db,
			sql,
			PREDICATES,
			predicateSlugs,
			isPredicateSlug,
			records: table('records'),
			links: table('links'),
			alias: (_value, name) => table(name),
			and: (...values) => sql.join(values, new SQLFragment(' AND ')),
			eq: comparison('='),
			lte: comparison('<='),
			desc,
			isNotNull: (value) => sql`${value} IS NOT NULL`,
			inArray: (value, values) =>
				sql`${value} IN (${sql.join(values.map((entry) => sql`${entry}`))})`,
			cosineDistance: (left, right) => sql`${left} <=> ${right}`
		},
		[
			'toCard',
			'cardColumns',
			'cardWith',
			'sourceWith',
			'linkColumns',
			'previewColumns',
			'byBest',
			'byChronology',
			'indexEntriesFor',
			'getRecordCards',
			'getRecordPage',
			'getSimilarRecords',
			'listArtifactCards',
			'searchRecords',
			'getFeedEntries'
		]
	);
	return { ...exports, calls };
}

function record(id = 1, overrides = {}) {
	return {
		id,
		type: 'artifact',
		title: `Record ${id}`,
		slug: `record-${id}`,
		abbreviation: 'RF',
		sense: 'A public sense',
		summary: 'Public summary',
		content: 'Public content',
		mediaCaption: 'Public caption',
		notes: 'Deliberately public notes',
		url: 'https://example.com/work',
		avatarUrl: 'https://example.com/avatar.png',
		contentCreatedAt: new Date('2020-01-01T00:00:00Z'),
		contentUpdatedAt: new Date('2020-02-01T00:00:00Z'),
		recordCreatedAt: new Date('2021-01-01T00:00:00Z'),
		recordUpdatedAt: new Date('2021-02-01T00:00:00Z'),
		isPrivate: false,
		recordCuratedAt: new Date('2022-01-01T00:00:00Z'),
		eloScore: 1200,
		formatId: 999,
		reminderAt: new Date('2030-01-01T00:00:00Z'),
		sources: ['INTERNAL source'],
		textEmbedding: [0.2, 0.9],
		textSearch: 'INTERNAL search',
		textEmbeddedAt: new Date(),
		futurePrivateField: 'FUTURE SECRET',
		format: null,
		media: [],
		outgoingLinks: [],
		incomingLinks: [],
		...overrides
	};
}
function media(id = 1, overrides = {}) {
	return {
		id,
		type: 'image',
		url: `https://example.com/${id}.png`,
		altText: 'Public alt text',
		width: 800,
		height: 600,
		contentTypeString: 'image/png',
		fileSize: 2048,
		recordId: 999,
		originalUrl: 'INTERNAL original',
		storageKey: 'INTERNAL storage',
		createdAt: new Date(),
		updatedAt: new Date(),
		futurePrivateField: 'FUTURE MEDIA SECRET',
		...overrides
	};
}
const outgoing = (id, predicate, target) => ({
	id,
	predicate,
	target,
	sourceId: 1,
	targetId: target?.id,
	privateLinkNote: 'SECRET link'
});
const incoming = (id, predicate, source) => ({
	id,
	predicate,
	source,
	sourceId: source?.id,
	targetId: 1,
	privateLinkNote: 'SECRET link'
});
const pick = (value, keys) => Object.fromEntries(keys.map((key) => [key, value[key]]));
function assertLink(link) {
	assert.deepEqual(sortedKeys(link), [...LINK_FIELDS].sort());
}
function assertCard(card) {
	assert.deepEqual(sortedKeys(card), [...PUBLIC_FIELDS, ...CARD_RELATIONS].sort());
	for (const key of INTERNAL_FIELDS)
		assert.equal(Object.hasOwn(card, key), false, `Leaked record field ${key}`);
	for (const item of card.media) assert.deepEqual(sortedKeys(item), [...MEDIA_FIELDS].sort());
	if (card.childMedia)
		assert.deepEqual(sortedKeys(card.childMedia), [...PREVIEW_MEDIA_FIELDS].sort());
	for (const link of [
		...card.creators,
		...card.tags,
		...card.children,
		...card.connections,
		...(card.format ? [card.format] : [])
	])
		assertLink(link);
	for (const attachment of [...card.parents, ...card.quoted, ...card.respondsTo]) {
		assert.deepEqual(
			sortedKeys(attachment),
			[...LINK_FIELDS, 'creators', ...('preview' in attachment ? ['preview'] : [])].sort()
		);
		attachment.creators.forEach(assertLink);
	}
	for (const group of [...card.attributions, ...card.references, ...card.extras])
		group.records.forEach(assertLink);
}

function assertProjection(config, context) {
	assert.ok(config.columns, `${context} must declare a scalar projection`);
	if (Object.keys(config.columns).length === 0)
		assert.ok(config.with, `${context} may omit scalars only when selecting nested relations`);
	assert.ok(
		Object.values(config.columns).every((enabled) => enabled === true),
		`${context} must use inclusion-only projections`
	);
	for (const [name, relation] of Object.entries(config.with ?? {}))
		assertProjection(relation, `${context}.${name}`);
}

test('card payload is an explicit runtime allowlist, including media and future schema additions', () => {
	const server = loadServer();
	const row = record(1, { media: [media()] });
	const card = server.toCard(row);
	assertCard(card);
	assert.deepEqual(pick(card, PUBLIC_FIELDS), pick(row, PUBLIC_FIELDS));
	assert.deepEqual(card.media, [pick(row.media[0], MEDIA_FIELDS)]);
	assert.notEqual(card.media[0], row.media[0], 'Media must be sanitized, not passed through');
	assert.equal(card.notes, 'Deliberately public notes');
	assert.equal(
		row.futurePrivateField,
		'FUTURE SECRET',
		'Sanitization must not mutate database rows'
	);
});

test('all relation queries use scalar allowlists and media keep ascending ID order', () => {
	const server = loadServer();
	assertProjection({ columns: server.cardColumns, with: server.cardWith }, 'card');
	assertProjection(server.sourceWith.source, 'preview source');
	assert.deepEqual(sortedKeys(server.cardColumns), [...PUBLIC_FIELDS].sort());
	assert.deepEqual(sortedKeys(server.cardWith.media.columns), [...MEDIA_FIELDS].sort());
	assert.deepEqual(server.cardWith.media.orderBy, { id: 'asc' });
	assert.deepEqual(server.sourceWith.source.with.media.orderBy, { id: 'asc' });
	for (const key of [
		'formatId',
		'reminderAt',
		'sources',
		'textEmbedding',
		'textSearch',
		'textEmbeddedAt',
		'futurePrivateField'
	]) {
		assert.equal(Object.hasOwn(server.linkColumns, key), false);
		assert.equal(Object.hasOwn(server.previewColumns, key), false);
	}
	assert.equal(
		server.previewColumns.notes,
		true,
		'Notes remain an intentional public preview source'
	);
});

test('private, uncurated, and missing relation targets are removed from every public relation bucket', () => {
	const { toCard } = loadServer();
	for (const hidden of [
		record(900, { isPrivate: true }),
		record(901, { recordCuratedAt: null }),
		null
	]) {
		const row = record(1, {
			format: hidden,
			outgoingLinks: predicateSlugs.map((predicate, index) =>
				outgoing(index + 1, predicate, hidden)
			),
			incomingLinks: predicateSlugs.map((predicate, index) =>
				incoming(index + 50, predicate, hidden)
			)
		});
		const card = toCard(row);
		assertCard(card);
		for (const key of [
			'creators',
			'attributions',
			'tags',
			'parents',
			'quoted',
			'respondsTo',
			'children',
			'references',
			'connections',
			'extras'
		])
			assert.deepEqual(card[key], [], key);
		assert.equal(card.format, null);
		assert.equal(card.childPreview, null);
		assert.equal(card.childMedia, null);
	}
});

test('visible titleless attachments and children keep intentional previews without becoming bare links', () => {
	const { toCard } = loadServer();
	const titleless = record(22, {
		title: null,
		summary: null,
		content: null,
		mediaCaption: null,
		notes: 'Titleless public notes',
		media: [media(7)]
	});
	const visibleCreator = record(30, { type: 'entity' });
	titleless.outgoingLinks = [
		outgoing(1, 'created_by', record(31, { isPrivate: true })),
		outgoing(2, 'created_by', record(32, { recordCuratedAt: null })),
		outgoing(3, 'created_by', record(33, { title: null })),
		outgoing(4, 'created_by', visibleCreator)
	];
	const card = toCard(
		record(1, {
			format: titleless,
			outgoingLinks: [
				'created_by',
				'tagged_with',
				'contained_by',
				'quotes',
				'responds_to',
				'related_to',
				'about'
			].map((predicate, index) => outgoing(index, predicate, titleless)),
			incomingLinks: [
				incoming(9, 'contained_by', titleless),
				incoming(10, 'quotes', titleless),
				incoming(11, 'related_to', titleless)
			]
		})
	);
	assertCard(card);
	for (const key of ['creators', 'tags', 'parents', 'connections', 'references'])
		assert.deepEqual(card[key], [], key);
	assert.equal(card.format, null);
	for (const key of ['quoted', 'respondsTo']) {
		assert.equal(card[key][0].title, null);
		assert.equal(card[key][0].preview, 'Titleless public notes');
		assert.deepEqual(ids(card[key][0].creators), [30]);
	}
	assert.deepEqual(ids(card.children), [22], 'Repeated containment predicates dedupe children');
	assert.equal(card.childPreview, 'Titleless public notes');
	assert.deepEqual(card.childMedia, pick(titleless.media[0], PREVIEW_MEDIA_FIELDS));
});

test('real preview helper preserves summary, content, caption, and deliberate notes precedence', () => {
	assert.equal(publicHelpers.recordPreview(record()), 'Public summary');
	assert.equal(publicHelpers.recordPreview(record(1, { summary: '' })), 'Public content');
	assert.equal(
		publicHelpers.recordPreview(record(1, { summary: null, content: '' })),
		'Public caption'
	);
	assert.equal(
		publicHelpers.recordPreview(record(1, { summary: null, content: null, mediaCaption: '' })),
		'Deliberately public notes'
	);
	assert.equal(
		publicHelpers.recordPreview(
			record(1, { summary: null, content: null, mediaCaption: null, notes: null })
		),
		null
	);
});

test('ranking ties, chronological children, attachment dedupe, and connection insertion order are preserved', () => {
	const { toCard, byBest, byChronology } = loadServer();
	const a = record(10, { eloScore: 900, contentCreatedAt: new Date('2020-01-01Z') });
	const b = record(11, { eloScore: 1200, contentCreatedAt: new Date('2019-01-01Z') });
	const c = record(12, {
		eloScore: 1200,
		contentCreatedAt: null,
		recordCreatedAt: new Date('2021-01-01Z')
	});
	const d = record(13, { eloScore: 1200, contentCreatedAt: new Date('2021-01-01Z') });
	const card = toCard(
		record(1, {
			outgoingLinks: [
				...[a, b, c, d].map((target, index) => outgoing(index + 1, 'created_by', target)),
				...[a, c, d, d].map((target, index) => outgoing(index + 10, 'quotes', target)),
				outgoing(90, 'related_to', a),
				outgoing(30, 'related_to', c)
			],
			incomingLinks: [
				...[d, c, b, a].map((source, index) => incoming(index + 40, 'contained_by', source)),
				incoming(60, 'quotes', c),
				incoming(20, 'related_to', b),
				incoming(70, 'related_to', a)
			]
		})
	);
	assert.deepEqual(ids(card.creators), [13, 12, 11, 10]);
	assert.deepEqual(ids(card.quoted), [13, 12, 10]);
	assert.deepEqual(ids(card.children), [11, 10, 12, 13]);
	assert.deepEqual(ids(card.connections), [11, 12, 10]);
	const columns = table('records');
	assert.deepEqual(
		byBest(columns, { desc }).map((fragment) => fragment.text),
		[
			'records.elo_score DESC',
			'coalesce(records.content_created_at, records.created_at) DESC',
			'records.id DESC'
		]
	);
	assert.deepEqual(
		byChronology(columns, { asc }).map((fragment) => fragment.text),
		['coalesce(records.content_created_at, records.created_at) ASC', 'records.id ASC']
	);
});

test('child fallback skips hidden children and nonvisual media, and sanitizes the chosen visual media', () => {
	const { toCard } = loadServer();
	const early = record(8, {
		contentCreatedAt: new Date('2018-01-01Z'),
		summary: null,
		content: null,
		mediaCaption: null,
		notes: null,
		media: [media(1, { type: 'audio' })]
	});
	const later = record(9, {
		contentCreatedAt: new Date('2019-01-01Z'),
		summary: 'First visible preview',
		media: [media(2, { type: 'video' }), media(3)]
	});
	const hidden = record(7, {
		isPrivate: true,
		contentCreatedAt: new Date('2010-01-01Z'),
		summary: 'PRIVATE PREVIEW',
		media: [media(0)]
	});
	const card = toCard(
		record(1, {
			incomingLinks: [
				incoming(3, 'contained_by', later),
				incoming(2, 'contained_by', early),
				incoming(1, 'contained_by', hidden)
			]
		})
	);
	assert.equal(card.childPreview, 'First visible preview');
	assert.deepEqual(card.childMedia, pick(later.media[0], PREVIEW_MEDIA_FIELDS));
	assertCard(card);
});

test('getRecordCards and searchRecords keep visibility guards and return only public DTOs', async () => {
	const server = loadServer({ many: [record()] });
	assert.deepEqual(await server.getRecordCards([]), []);
	assert.equal(server.calls.length, 0);
	for (const card of await server.getRecordCards([1], 'chronological', 4)) assertCard(card);
	for (const card of await server.searchRecords('fixture', 'artifact')) assertCard(card);
	const [cards, search] = server.calls;
	assert.deepEqual(cards.config.where, {
		id: { in: [1] },
		isPrivate: false,
		recordCuratedAt: { isNotNull: true }
	});
	assert.equal(cards.config.orderBy, server.byChronology);
	assert.equal(cards.config.limit, 4);
	assert.equal(search.config.where.isPrivate, false);
	assert.deepEqual(search.config.where.recordCuratedAt, { isNotNull: true });
	assert.deepEqual(search.config.where.title, { isNotNull: true });
	for (const { config } of server.calls) assertProjection(config, 'card query');
});

test('record page override keeps incoming-link projections and does not serialize formatOf', async () => {
	const server = loadServer({
		first: { ...record(), formatOf: [{ id: 20, privateField: 'SECRET' }] }
	});
	const page = await server.getRecordPage(1);
	assertCard(page.record);
	assert.equal(Object.hasOwn(page.record, 'formatOf'), false);
	assertProjection(server.calls[0].config, 'record page');
	assert.deepEqual(server.calls[0].config.with.formatOf.columns, { id: true });
	const missing = loadServer();
	assert.equal(await missing.getRecordPage(900), null);
});

test('similar-record embedding stays server-side and result cards remain projected', async () => {
	const server = loadServer({
		first: record(1, {
			outgoingLinks: [outgoing(1, 'contained_by', record(2))],
			incomingLinks: [incoming(2, 'quotes', record(3))]
		}),
		many: [record(4)]
	});
	const cards = await server.getSimilarRecords(1);
	cards.forEach(assertCard);
	const [seed, result] = server.calls;
	assert.deepEqual(seed.config.columns, { textEmbedding: true });
	assertProjection(seed.config, 'similar-record seed');
	assertProjection(result.config, 'similar-record results');
	assert.deepEqual(result.config.where.id, { notIn: [1, 2, 3] });
	assert.deepEqual(result.config.where.NOT, {
		outgoingLinks: { predicate: 'contained_by', targetId: { in: [2] } }
	});
	assert.equal(result.config.where.isPrivate, false);
	assert.deepEqual(result.config.where.title, { isNotNull: true });
});

async function createCountFixture() {
	const server = loadServer();
	await server.indexEntriesFor('entity', 100);
	const count = server.calls.find((call) => call.operation === 'select').selection.count;
	assert.ok(count instanceof SQLFragment, 'Count must come from the actual query function');
	const db = new DatabaseSync(':memory:');
	db.exec(`CREATE TABLE records (id INTEGER PRIMARY KEY, is_private INTEGER NOT NULL DEFAULT 0, curated_at TEXT, title TEXT);
		CREATE TABLE links (id INTEGER PRIMARY KEY, source_id INTEGER, target_id INTEGER, predicate TEXT);`);
	const addRecord = db.prepare(
		'INSERT INTO records (id, is_private, curated_at, title) VALUES (?, ?, ?, ?)'
	);
	const addLink = db.prepare(
		'INSERT INTO links (source_id, target_id, predicate) VALUES (?, ?, ?)'
	);
	return {
		addRecord(id, { private: hidden = false, curated = true, title = `Record ${id}` } = {}) {
			addRecord.run(id, Number(hidden), curated ? '2026-01-01' : null, title);
		},
		addLink(source, target, predicate) {
			addLink.run(source, target, predicate);
		},
		count(id) {
			const query = `SELECT ${count.text.replace(/::int\b/g, '')} AS count FROM records WHERE records.id = ?`;
			return db.prepare(query).get(...count.params, id).count;
		},
		close() {
			db.close();
		}
	};
}

test('index count excludes paths through private and uncurated works', async () => {
	const fixture = await createCountFixture();
	try {
		fixture.addRecord(1);
		fixture.addRecord(10);
		fixture.addRecord(11, { private: true });
		fixture.addRecord(12, { curated: false });
		for (const id of [20, 21, 22]) fixture.addRecord(id);
		for (const work of [10, 11, 12]) fixture.addLink(work, 1, 'created_by');
		fixture.addLink(20, 10, 'contained_by');
		fixture.addLink(21, 11, 'contained_by');
		fixture.addLink(22, 12, 'quotes');
		assert.equal(fixture.count(1), 2, 'Only visible work 10 and its visible child 20 count');
	} finally {
		fixture.close();
	}
});

test('index count preserves direct paths, dedupes children, and excludes hidden/titleless contributors', async () => {
	const fixture = await createCountFixture();
	try {
		fixture.addRecord(1);
		fixture.addRecord(10);
		fixture.addRecord(11, { private: true });
		for (const id of [20, 21, 22]) fixture.addRecord(id);
		fixture.addRecord(23, { private: true });
		fixture.addRecord(24, { curated: false });
		fixture.addRecord(25, { title: null });
		fixture.addLink(10, 1, 'created_by');
		fixture.addLink(11, 1, 'created_by');
		fixture.addLink(20, 10, 'contained_by');
		fixture.addLink(20, 10, 'quotes');
		fixture.addLink(20, 1, 'about');
		fixture.addLink(21, 11, 'quotes');
		fixture.addLink(21, 1, 'tagged_with');
		fixture.addLink(22, 1, 'references');
		for (const id of [23, 24, 25]) {
			fixture.addLink(id, 10, 'contained_by');
			fixture.addLink(id, 1, 'responds_to');
		}
		assert.equal(
			fixture.count(1),
			4,
			'Visible work 10, deduped child 20, independently direct 21, and direct 22'
		);
	} finally {
		fixture.close();
	}
});

test('visible titleless intermediate works still contribute their listable children', async () => {
	const fixture = await createCountFixture();
	try {
		fixture.addRecord(1);
		fixture.addRecord(10, { title: null });
		fixture.addRecord(20);
		fixture.addLink(10, 1, 'created_by');
		fixture.addLink(20, 10, 'contained_by');
		assert.equal(
			fixture.count(1),
			1,
			'Only the titled child counts; the visible intermediate work remains traversable'
		);
	} finally {
		fixture.close();
	}
});

test('artifact lists and recursive feed use projected queries and public card DTOs', async () => {
	const root = record(1);
	const child = record(2, { title: null, media: [media(2)] });
	const hidden = record(3, { isPrivate: true });
	root.incomingLinks = [incoming(1, 'contained_by', child), incoming(2, 'contained_by', hidden)];
	child.outgoingLinks = [outgoing(1, 'contained_by', root)];
	const makeServer = () =>
		loadServer({
			linkRows: [
				{ id: 1, source: child, target: root },
				{ id: 2, source: hidden, target: root }
			],
			many: (config) => (config.with ? [root, child] : [])
		});
	const listServer = makeServer();
	const cards = await listServer.listArtifactCards();
	assert.deepEqual(ids(cards), [1]);
	cards.forEach(assertCard);
	const feedServer = makeServer();
	const feed = await feedServer.getFeedEntries();
	assert.deepEqual(
		feed.map((entry) => entry.record.id),
		[1]
	);
	assert.deepEqual(
		feed[0].children.map((entry) => entry.record.id),
		[2]
	);
	assertCard(feed[0].record);
	assertCard(feed[0].children[0].record);
	for (const { config } of [...listServer.calls, ...feedServer.calls])
		assertProjection(config, 'list/feed query');
});
