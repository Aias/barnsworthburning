import { mapExtractRecord } from '$helpers/mapping';
import { airtableFetch } from '$lib/server/requests';
import {
	AirtableBaseId,
	extractFields,
	ExtractView,
	Table,
	type IBaseExtract,
	type IExtract
} from '$types/Airtable';
import markdown from '$helpers/markdown';
import { getArticle, combineAsList } from '$helpers/grammar';
import xmlFormatter from 'xml-formatter';
import { getCacheHeaders } from '$helpers/cache';

const escapeXml = (str: string): string =>
	str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');

const safeDate = (dateStr: string): Date => {
	const date = new Date(dateStr);
	return isNaN(date.getTime()) ? new Date() : date;
};

const generateImageProxyUrl = (recordId: string, index: number) => {
	return `${meta.imageProxyUrl}/${AirtableBaseId}/${Table.Extracts}/${recordId}?index=${index}`;
};

const makeSiteLink = (relativePath: string, title: string) =>
	`<a href="${meta.url}/${relativePath}">${title}</a>`;

const generateContentMarkup = (extract: IExtract, isChild: boolean = false) => {
	const {
		id,
		extract: content,
		notes,
		format,
		source,
		images,
		imageCaption,
		creators,
		connections,
		spaces,
		parent
	} = extract;
	const type = (format || 'extract').toLowerCase();
	let markup = '<article>\n';
	if (!isChild) {
		markup += '<header>\n';
		markup += '<p>';
		markup += `${getArticle(type)} <strong>${type}</strong>`;
		if (creators) {
			const creatorsMarkup = markdown.parseInline(
				combineAsList(creators.map((c) => `[${c.name}](${meta.url}/creators/${c.id})`))
			);
			markup += ` by ${creatorsMarkup}`;
		}
		if (parent) {
			markup += ` from <em>${parent.name}</em>`;
		}
		markup += '.</p>\n';
		markup += '</header>\n';
	}
	markup += '<section>\n';
	if (images) {
		markup += '<figure>\n';
		markup += images
			.map(
				({ filename, type = 'image/*' }, index) =>
					`<img src="${generateImageProxyUrl(id, index)}" alt="${escapeXml(filename || 'Image from extract')}" type="${type}" />\n`
			)
			.join('');
		if (imageCaption) {
			markup += `<figcaption>${markdown.parse(imageCaption)}</figcaption>\n`;
		}
		markup += '</figure>\n';
	}
	if (content) {
		markup += '<blockquote>\n';
		markup += markdown.parse(content);
		markup += '</blockquote>\n';
	}
	if (source) {
		let linkText;
		try {
			linkText = new URL(source).hostname;
		} catch {
			linkText = source;
		}
		markup += `<p>Source: <a href="${source}">${linkText}</a></p>\n`;
	}
	if (connections) {
		markup += '<p>Related:</p>\n';
		markup += '<ul>\n';
		markup += connections
			.map(
				(connection) => `<li>${makeSiteLink(`extracts/${connection.id}`, connection.name)}</li>\n`
			)
			.join('');
		markup += '</ul>\n';
	}
	if (spaces) {
		markup += `<p>\n<small>`;
		markup += spaces
			.map((space) => makeSiteLink(`spaces/${space.id}`, `#${space.name}`))
			.join(' • ');
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

const cleanLink = (link: string) => {
	return link.replace(/&/g, '&amp;');
};

const meta = {
	title: 'barnsworthburning',
	description: 'A commonplace book.',
	author: {
		name: 'Nick Trombley',
		email: 'trombley.nick@gmail.com',
		url: 'https://nicktrombley.design'
	},
	tags: ['design', 'knowledge', 'making', 'architecture', 'art'],
	url: 'https://barnsworthburning.net',
	imageProxyUrl: 'https://airtable-media-proxy.trombley-nick.workers.dev'
};

const getChildExtracts = (extract: IExtract, children: IExtract[]): IExtract[] =>
	extract.children
		?.map((child) => children.find((entry) => entry.id === child.id))
		.filter((child): child is IExtract => !!child) || [];

const generateEntry = (extract: IExtract, children: IExtract[]): string => {
	const { title, id, creators, source, lastUpdated, publishedOn, spaces, images } = extract;
	const extractChildren = getChildExtracts(extract, children);
	const publishedDate = safeDate(publishedOn);
	const updatedDate = safeDate(lastUpdated);

	const entryParts: string[] = [];
	entryParts.push(`<entry>`);
	entryParts.push(`<id>${meta.url}/extracts/${id}</id>`);
	entryParts.push(`<title><![CDATA[${title || 'Untitled'}]]></title>`);
	if (creators) {
		entryParts.push(
			creators
				.map((creator) => `<author><name><![CDATA[${creator.name || 'Unknown'}]]></name></author>`)
				.join('\n')
		);
	}
	entryParts.push(`<published>${publishedDate.toISOString()}</published>`);
	entryParts.push(
		`<updated>${new Date(Math.max(publishedDate.getTime(), updatedDate.getTime())).toISOString()}</updated>`
	);
	entryParts.push(`<link rel="alternate" href="${meta.url}/extracts/${id}" />`);
	if (source) {
		entryParts.push(`<link rel="via" href="${cleanLink(source)}" />`);
	}
	if (images) {
		entryParts.push(
			images
				.map(
					({ filename, type = 'image/*' }, index) =>
						`<link rel="enclosure" href="${generateImageProxyUrl(id, index)}" type="${type}" title="${escapeXml(filename || 'image')}" />`
				)
				.join('\n')
		);
	}
	if (spaces) {
		entryParts.push(
			spaces.map((space) => `<category term="${escapeXml(space.name)}" />`).join('\n')
		);
	}
	entryParts.push(`<content type="html"><![CDATA[`);
	entryParts.push(generateContentMarkup(extract));
	if (extractChildren.length) {
		entryParts.push(
			extractChildren
				.map((child) => {
					const { title } = child;
					return `<br><hr><br><h3>${title}</h3>${generateContentMarkup(child, true)}`;
				})
				.join('\n')
		);
	}
	entryParts.push(`]]></content>`);
	entryParts.push(`</entry>`);

	return entryParts.join('');
};

const atom = (entries: IExtract[] = [], children: IExtract[] = []) => {
	const feedUpdated =
		entries.length > 0
			? new Date(
					Math.max(
						...entries.map((entry) =>
							Math.max(
								safeDate(entry.lastUpdated).getTime(),
								safeDate(entry.publishedOn).getTime(),
								safeDate(entry.extractedOn).getTime()
							)
						)
					)
				).toISOString()
			: new Date().toISOString();
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
        ${entries.map((extract) => generateEntry(extract, children)).join('\n')}
</feed>`.trim();
};

export async function GET() {
	const fetchEntryOptions = {
		view: ExtractView.Feed,
		maxRecords: 30,
		fields: extractFields
	};
	const extracts = await airtableFetch<IBaseExtract>(Table.Extracts, fetchEntryOptions);
	const feedEntries = extracts.map(mapExtractRecord);
	const parentIds = feedEntries.map((extract) => extract.id).join(',');

	const fetchChildOptions = {
		filterByFormula: `AND(parent, FIND(ARRAYJOIN(parentId), '${parentIds}') > 0)`,
		fields: extractFields
	};
	const childExtracts = await airtableFetch<IBaseExtract>(Table.Extracts, fetchChildOptions);
	const entryChildren = childExtracts.map(mapExtractRecord);

	const responseBody = xmlFormatter(atom(feedEntries, entryChildren), {
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
