import { getCacheHeaders } from '#helpers/cache.js';
import { capitalize, combineAsList, getArticle } from '#helpers/grammar.js';
import markdown from '#helpers/markdown.js';
import {
	displayTitle,
	formatLabel,
	recordPath,
	type FeedEntry,
	type RecordCard,
	type RecordLink
} from '#lib/records.js';
import { getFeedEntries } from '#lib/server/records.js';
import xmlFormatter from 'xml-formatter';

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

const makeSiteLink = (relativePath: string, title: string) =>
	`<a href="${meta.url}${relativePath}">${title}</a>`;

const cleanLink = (link: string) => {
	return link.replace(/&/g, '&amp;');
};

const feedMedia = (record: RecordCard) =>
	record.media.filter((item) => item.type === 'image' || item.type === 'video');

const recordLinkList = (records: RecordLink[]) =>
	markdown.parseInline(
		combineAsList(
			records.map((record) => `[${displayTitle(record)}](${meta.url}${recordPath(record)})`)
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
	const media = feedMedia(record);
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
	const text = content ?? summary;
	if (text) {
		markup += '<blockquote>\n';
		markup += markdown.parse(text);
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
	const enclosures = flattenRecords(entry).flatMap(feedMedia);
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
	entryParts.push(`<link rel="alternate" href="${meta.url}${recordPath(record)}" />`);
	if (record.url) {
		entryParts.push(`<link rel="via" href="${cleanLink(record.url)}" />`);
	}
	if (enclosures.length > 0) {
		entryParts.push(
			enclosures
				.map(
					(item) =>
						`<link rel="enclosure" href="${item.url}" type="${item.contentTypeString}"${item.altText ? ` title="${item.altText}"` : ''} />`
				)
				.join('\n')
		);
	}
	if (record.tags.length > 0) {
		entryParts.push(
			record.tags.map((tag) => `<category term="${displayTitle(tag)}" />`).join('\n')
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

const atom = (entries: FeedEntry[]) => {
	const feedUpdated = new Date(
		Math.max(...entries.map((entry) => entryUpdated(entry).getTime()))
	).toISOString();
	return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">
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
    <updated>${feedUpdated}</updated>
	${meta.tags.map((tag) => `<category term="${tag}" />`).join('\n')}
        ${entries.map((entry) => generateEntry(entry)).join('\n')}
</feed>`.trim();
};

export async function GET() {
	const entries = await getFeedEntries();

	const responseBody = xmlFormatter(atom(entries), {
		collapseContent: true
	});
	const responseOptions = {
		status: 200,
		headers: {
			'Content-Type': 'application/atom+xml; charset=utf-8',
			...getCacheHeaders('feed')
		}
	};

	return new Response(responseBody, responseOptions);
}
