import { getCacheHeaders } from '$helpers/cache';
import { getArticle, combineAsList } from '$helpers/grammar';
import markdown from '$helpers/markdown';
import {
	displayTitle,
	formatLabel,
	recordPath,
	type FeedEntry,
	type RecordCard
} from '$lib/records';
import { getFeedEntries } from '$lib/server/records';
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

const images = (record: RecordCard) => record.media.filter((item) => item.type === 'image');

const generateContentMarkup = (record: RecordCard, isChild: boolean = false) => {
	const { content, notes, url, mediaCaption, creators, connections, tags, parents } = record;
	const parent = parents[0];
	const format = formatLabel(record.format)?.toLowerCase();
	const recordImages = images(record);
	let markup = '<article>\n';
	if (!isChild && (format || creators.length > 0 || parent)) {
		const phrases: string[] = [];
		if (format) {
			phrases.push(`${getArticle(format)} <strong>${format}</strong>`);
		}
		if (creators.length > 0) {
			const creatorsMarkup = markdown.parseInline(
				combineAsList(
					creators.map((creator) => `[${displayTitle(creator)}](${meta.url}${recordPath(creator)})`)
				)
			);
			phrases.push(format ? `by ${creatorsMarkup}` : `By ${creatorsMarkup}`);
		}
		if (parent) {
			phrases.push(
				format || creators.length > 0
					? `from <em>${displayTitle(parent)}</em>`
					: `From <em>${displayTitle(parent)}</em>`
			);
		}
		markup += '<header>\n';
		markup += `<p>${phrases.join(' ')}.</p>\n`;
		markup += '</header>\n';
	}
	markup += '<section>\n';
	if (recordImages.length > 0) {
		markup += '<figure>\n';
		markup += recordImages
			.map(
				(image) =>
					`<img src="${image.url}" alt="${image.altText ?? ''}" type="${image.contentTypeString}" />\n`
			)
			.join('');
		if (mediaCaption) {
			markup += `<figcaption>${markdown.parse(mediaCaption)}</figcaption>\n`;
		}
		markup += '</figure>\n';
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
	if (connections.length > 0) {
		markup += '<p>Related:</p>\n';
		markup += '<ul>\n';
		markup += connections
			.map(
				(connection) =>
					`<li>${makeSiteLink(recordPath(connection), displayTitle(connection))}</li>\n`
			)
			.join('');
		markup += '</ul>\n';
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

const published = (record: RecordCard) => record.contentCreatedAt ?? record.recordCreatedAt;

const updated = (record: RecordCard) =>
	new Date(
		Math.max(
			record.recordUpdatedAt.getTime(),
			(record.contentUpdatedAt ?? record.recordUpdatedAt).getTime()
		)
	);

const generateEntry = ({ record, children }: FeedEntry): string => {
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
	entryParts.push(`<published>${published(record).toISOString()}</published>`);
	entryParts.push(
		`<updated>${new Date(
			Math.max(published(record).getTime(), updated(record).getTime())
		).toISOString()}</updated>`
	);
	entryParts.push(`<link rel="alternate" href="${meta.url}${recordPath(record)}" />`);
	if (record.url) {
		entryParts.push(`<link rel="via" href="${cleanLink(record.url)}" />`);
	}
	entryParts.push(
		images(record)
			.map(
				(image) =>
					`<link rel="enclosure" href="${image.url}" type="${image.contentTypeString}"${image.altText ? ` title="${image.altText}"` : ''} />`
			)
			.join('\n')
	);
	if (record.tags.length > 0) {
		entryParts.push(
			record.tags.map((tag) => `<category term="${displayTitle(tag)}" />`).join('\n')
		);
	}
	entryParts.push(`<content type="html"><![CDATA[`);
	entryParts.push(generateContentMarkup(record));
	if (children.length > 0) {
		entryParts.push(
			children
				.map(
					(child) =>
						`<br><hr><br><h3>${displayTitle(child)}</h3>${generateContentMarkup(child, true)}`
				)
				.join('\n')
		);
	}
	entryParts.push(`]]></content>`);
	entryParts.push(`</entry>`);

	return entryParts.join('');
};

const atom = (entries: FeedEntry[]) => {
	const feedUpdated = new Date(
		Math.max(
			...entries.map(({ record }) =>
				Math.max(updated(record).getTime(), published(record).getTime())
			)
		)
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
