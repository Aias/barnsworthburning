import { createHash } from 'node:crypto';
import { getCacheHeaders } from '#helpers/cache.js';
import { capitalize, combineAsList, getArticle } from '#helpers/grammar.js';
import markdown from '#helpers/markdown.js';
import {
	displayTitle,
	formatLabel,
	recordPath,
	visualMedia,
	type FeedEntry,
	type RecordCard,
	type RecordLink
} from '#lib/records.js';
import { getFeedEntries } from '#lib/server/records.js';
import type { MediaSelect } from '@aias/hozo';
import xmlFormatter from 'xml-formatter';
import type { RequestHandler } from './$types';

const meta = {
	title: 'barnsworthburning',
	description: 'A commonplace book.',
	author: {
		name: 'Nick Trombley',
		email: 'trombley.nick@gmail.com',
		url: 'https://nicktrombley.design'
	},
	tags: ['design', 'knowledge', 'making', 'architecture', 'art'],
	url: 'https://barnsworthburning.net'
};

const siteHref = (relativePath: string) => `${meta.url}${relativePath}?utm_source=rss`;

const makeSiteLink = (relativePath: string, title: string) =>
	`<a href="${siteHref(relativePath)}">${title}</a>`;

const escapeAttribute = (value: string) =>
	value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const recordLinkList = (records: RecordLink[]) =>
	markdown.parseInline(
		combineAsList(
			records.map((record) => `[${displayTitle(record)}](${siteHref(recordPath(record))})`)
		)
	);

const linkRow = (label: string, records: RecordLink[]) => {
	let markup = `<p>${label}:</p>\n`;
	markup += '<ul>\n';
	markup += records
		.map((record) => `<li>${makeSiteLink(recordPath(record), displayTitle(record))}</li>\n`)
		.join('');
	markup += '</ul>\n';
	return markup;
};

const sameRecords = (a: RecordLink[], b: RecordLink[]) =>
	a.length === b.length && a.every((record, index) => record.id === b[index]?.id);

/**
 * The citation sentence: "An essay by X, edited by Y, from Z." Descendant
 * sections cite only what differs from the root, and never their container —
 * the entry's structure already shows it.
 */
const citationPhrases = (record: RecordCard, root?: RecordCard): string[] => {
	const phrases: string[] = [];
	const format = formatLabel(record.format);
	const parent = record.parents[0];
	if (format && (!root || format !== formatLabel(root.format))) {
		phrases.push(`${getArticle(format)} <strong>${format.toLowerCase()}</strong>`);
	}
	if (record.creators.length > 0 && (!root || !sameRecords(record.creators, root.creators))) {
		phrases.push(`by ${recordLinkList(record.creators)}`);
	}
	for (const group of record.attributions) {
		phrases.push(`${group.label} ${recordLinkList(group.records)}`);
	}
	if (!root && parent) {
		phrases.push(`from <em>${displayTitle(parent)}</em>`);
	}
	return phrases;
};

const generateContentMarkup = (record: RecordCard, root?: RecordCard) => {
	const { content, summary, notes, url, mediaCaption, connections, tags } = record;
	const media = visualMedia(record.media);
	const phrases = citationPhrases(record, root);
	let markup = '<article>\n';
	if (phrases.length > 0) {
		const [first, ...rest] = phrases;
		markup += '<header>\n';
		markup += `<p>${[capitalize(first), ...rest].join(' ')}.</p>\n`;
		markup += '</header>\n';
	}
	markup += '<section>\n';
	if (media.length > 0) {
		markup += '<figure>\n';
		markup += media
			.map((item) =>
				item.type === 'video'
					? `<video controls src="${item.url}"></video>\n`
					: `<img src="${item.url}" alt="${item.altText ?? ''}" type="${item.contentTypeString}" />\n`
			)
			.join('');
		if (mediaCaption) {
			markup += `<figcaption>${markdown.parse(mediaCaption)}</figcaption>\n`;
		}
		markup += '</figure>\n';
	}
	if (summary) {
		markup += `<p><em>${markdown.parseInline(summary)}</em></p>\n`;
	}
	if (content) {
		markup += '<blockquote>\n';
		markup += markdown.parse(content);
		markup += '</blockquote>\n';
	}
	if (url) {
		let linkText;
		try {
			linkText = new URL(url).hostname;
		} catch {
			linkText = url;
		}
		markup += `<p>Source: <a href="${url}">${linkText}</a></p>\n`;
	}
	for (const group of [...record.references, ...record.extras]) {
		markup += linkRow(capitalize(group.label), group.records);
	}
	if (connections.length > 0) {
		markup += linkRow('Related', connections);
	}
	if (tags.length > 0) {
		markup += `<p>\n<small>`;
		markup += tags.map((tag) => makeSiteLink(recordPath(tag), `#${displayTitle(tag)}`)).join(' • ');
		markup += `</small>\n</p>\n`;
	}
	if (notes) {
		markup += '<hr>\n';
		markup += `<small>${markdown.parse(notes)}</small>\n`;
	}
	markup += '</section>\n';
	markup += '</article>';

	return markup;
};

const dimensionAttributes = (item: MediaSelect) =>
	`${item.width ? ` width="${item.width}"` : ''}${item.height ? ` height="${item.height}"` : ''}`;

const flattenRecords = (entry: FeedEntry): RecordCard[] => [
	entry.record,
	...entry.children.flatMap(flattenRecords)
];

const recordUpdated = (record: RecordCard) =>
	Math.max(
		record.recordUpdatedAt.getTime(),
		(record.contentUpdatedAt ?? record.recordUpdatedAt).getTime()
	);

const entryUpdated = (entry: FeedEntry) =>
	new Date(
		Math.max(entry.record.recordCreatedAt.getTime(), ...flattenRecords(entry).map(recordUpdated))
	);

/**
 * Descendant sections nest by containment depth — direct children under h3,
 * grandchildren under h4, and so on — while titleless records get only the
 * separator.
 */
const generateDescendants = (entry: FeedEntry, root: RecordCard, depth: number): string =>
	entry.children
		.map((child) => {
			const level = Math.min(depth + 2, 6);
			const heading = child.record.title ? `<h${level}>${child.record.title}</h${level}>` : '';
			return `<br><hr><br>${heading}${generateContentMarkup(child.record, root)}${generateDescendants(child, root, depth + 1)}`;
		})
		.join('\n');

const generateEntry = (entry: FeedEntry): string => {
	const { record } = entry;
	const enclosures = flattenRecords(entry).flatMap((item) => visualMedia(item.media));
	const entryParts: string[] = [];
	entryParts.push(`<entry>`);
	entryParts.push(`<id>${meta.url}/records/${record.id}</id>`);
	entryParts.push(`<title><![CDATA[${displayTitle(record)}]]></title>`);
	if (record.creators.length > 0) {
		entryParts.push(
			record.creators
				.map((creator) => `<author><name><![CDATA[${displayTitle(creator)}]]></name></author>`)
				.join('\n')
		);
	}
	entryParts.push(`<published>${record.recordCreatedAt.toISOString()}</published>`);
	entryParts.push(`<updated>${entryUpdated(entry).toISOString()}</updated>`);
	entryParts.push(
		`<link rel="alternate" type="text/html" href="${siteHref(recordPath(record))}" />`
	);
	if (record.url) {
		entryParts.push(`<link rel="via" href="${escapeAttribute(record.url)}" />`);
	}
	if (enclosures.length > 0) {
		entryParts.push(
			enclosures
				.map(
					(item) =>
						`<link rel="enclosure" href="${escapeAttribute(item.url)}" type="${item.contentTypeString}"${item.fileSize ? ` length="${item.fileSize}"` : ''}${item.altText ? ` title="${escapeAttribute(item.altText)}"` : ''} />`
				)
				.join('\n')
		);
		entryParts.push(
			enclosures
				.map(
					(item) =>
						`<media:content url="${escapeAttribute(item.url)}" type="${item.contentTypeString}" medium="${item.type}"${item.fileSize ? ` fileSize="${item.fileSize}"` : ''}${dimensionAttributes(item)} />`
				)
				.join('\n')
		);
		const thumbnail = enclosures.find((item) => item.type === 'image');
		if (thumbnail) {
			entryParts.push(
				`<media:thumbnail url="${escapeAttribute(thumbnail.url)}"${dimensionAttributes(thumbnail)} />`
			);
		}
	}
	if (record.tags.length > 0) {
		entryParts.push(
			record.tags
				.map((tag) => `<category term="${escapeAttribute(displayTitle(tag))}" />`)
				.join('\n')
		);
	}
	entryParts.push(`<content type="html"><![CDATA[`);
	entryParts.push(generateContentMarkup(record));
	if (entry.children.length > 0) {
		entryParts.push(generateDescendants(entry, record, 1));
	}
	entryParts.push(`]]></content>`);
	entryParts.push(`</entry>`);

	return entryParts.join('');
};

const feedUpdated = (entries: FeedEntry[]) =>
	new Date(Math.max(...entries.map((entry) => entryUpdated(entry).getTime())));

const atom = (entries: FeedEntry[], updated: Date) => {
	return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/" xml:lang="en">
    <id>${meta.url}/feed</id>
    <title>${meta.title}</title>
    <subtitle>${meta.description}</subtitle>
    <link href="${meta.url}/feed.xml" rel="self" />
    <link href="${meta.url}" />
    <icon>${meta.url}/favicon.png</icon>
    <author>
        <name>${meta.author.name}</name>
        <email>${meta.author.email}</email>
        <uri>${meta.author.url}</uri>
    </author>
    <updated>${updated.toISOString()}</updated>
	${meta.tags.map((tag) => `<category term="${tag}" />`).join('\n')}
        ${entries.map((entry) => generateEntry(entry)).join('\n')}
</feed>`.trim();
};

export const GET: RequestHandler = async ({ request }) => {
	const entries = await getFeedEntries();
	const updated = feedUpdated(entries);
	const responseBody = xmlFormatter(atom(entries, updated), {
		collapseContent: true
	});
	const etag = `"${createHash('sha256').update(responseBody).digest('base64url')}"`;
	const headers = {
		'Content-Type': 'application/atom+xml; charset=utf-8',
		ETag: etag,
		'Last-Modified': updated.toUTCString(),
		...getCacheHeaders('feed')
	};
	const ifNoneMatch = request.headers.get('if-none-match');
	const modifiedSince = Date.parse(request.headers.get('if-modified-since') ?? '');
	const updatedSeconds = updated.getTime() - (updated.getTime() % 1000);
	const notModified = ifNoneMatch ? ifNoneMatch.includes(etag) : updatedSeconds <= modifiedSince;
	if (notModified) {
		return new Response(null, { status: 304, headers });
	}
	return new Response(responseBody, { status: 200, headers });
};
