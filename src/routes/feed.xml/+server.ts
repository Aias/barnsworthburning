import { mapExtractRecord } from '$helpers/mapping';
import { airtableFetch } from '$lib/server/requests';
import { ExtractView, Table, type IBaseExtract, type IExtract } from '$types/Airtable';
import markdown from '$helpers/markdown';
import { getArticle, combineAsList } from '$helpers/grammar';
import xmlFormatter from 'xml-formatter';

const makeSiteLink = (relativePath: string, title: string) =>
	`<a href="${meta.url}/${relativePath}">${title}</a>`;

const generateContentMarkup = (extract: IExtract) => {
	const {
		extract: content,
		notes,
		format,
		source,
		images,
		imageCaption,
		creators,
		connections,
		spaces
	} = extract;
	let type = (format || 'extract').toLowerCase();
	let markup = '<article>\n';
	markup += '<header>\n';
	markup += '<p>';
	markup += `${getArticle(type)} <strong>${type}</strong>`;
	if (creators) {
		const creatorsMarkup = markdown.parseInline(
			combineAsList(creators.map((c) => `[${c.name}](${meta.url}/creators/${c.id})`))
		);
		markup += ` by ${creatorsMarkup}`;
	}
	markup += '</p>\n';
	markup += '</header>\n';
	markup += '<section>\n';
	if (images) {
		markup += '<figure>\n';
		markup += images
			.map(({ url, filename }) => `<img src="${url}" alt="${filename}" />\n`)
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
		markup += `<p>[<a href="${source}">Source</a>]</p>\n`;
	}
	if (connections) {
		markup += '<p>Related:</p>\n';
		markup += '<ul>\n';
		markup += connections
			.map(
				(connection) =>
					`<li>${makeSiteLink(`extracts/${connection.id}`, connection.name)}</li>\n`
			)
			.join('');
		markup += '</ul>\n';
	}
	if (spaces) {
		markup += `<p>\n<small>`;
		markup += spaces
			.map((space) => makeSiteLink(`spaces/${space.id}`, `# ${space.name}`))
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
	url: 'https://barnsworthburning.net'
};

const atom = (entries: IExtract[] = [], children: IExtract[] = []) => {
	const feedUpdated = new Date(entries[0].lastUpdated).toISOString();
	return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
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
	${entries
		.map((extract) => {
			const { title, id, creators, source, lastUpdated, extractedOn, spaces, images } =
				extract;
			const extractChildren =
				extract.children
					?.map((child) => children.find((entry) => entry.id === child.id))
					.filter((child): child is IExtract => !!child) || [];

			let entry = `<entry>`;
			entry += `<id>${meta.url}/extracts/${id}</id>`;
			entry += `<title><![CDATA[${title}]]></title>`;
			if (creators) {
				entry += creators
					.map((creator) => `<author><name><![CDATA[${creator.name}]]></name></author>`)
					.join('\n');
			}
			entry += `<published>${new Date(extractedOn).toISOString()}</published>`;
			entry += `<updated>${new Date(lastUpdated).toISOString()}</updated>`;
			entry += `<link rel="alternate" href="${meta.url}/extracts/${id}" />`;
			if (source) {
				entry += `<link rel="via" href="${cleanLink(source)}" />`;
			}
			if (images) {
				entry += images
					.map(
						(image) =>
							`<link rel="enclosure" href="${cleanLink(image.url)}" type="${image.type}" />`
					)
					.join('\n');
			}
			if (spaces) {
				entry += spaces.map((space) => `<category term="${space.name}" />`).join('\n');
			}
			entry += `<content type="html"><![CDATA[`;
			entry += generateContentMarkup(extract);
			if (extractChildren.length) {
				entry += extractChildren
					.map((child) => {
						const { title } = child;
						let childMarkup = `<br><hr><br>`;
						childMarkup += `<h3>${title}</h3>`;
						childMarkup += generateContentMarkup(child);
						return childMarkup;
					})
					.join('\n');
			}
			entry += `]]></content>`;
			entry += '</entry>';
			return entry;
		})
		.join('\n')}
</feed>`;
};

export async function GET() {
	const fetchEntryOptions = {
		view: ExtractView.Works,
		maxRecords: 30,
		filterByFormula: `AND(lastUpdated < DATEADD(NOW(), -10, 'minute'), NOT(parent))`
	};
	const extracts = await airtableFetch<IBaseExtract>(Table.Extracts, fetchEntryOptions);
	const feedEntries = extracts.map(mapExtractRecord);
	const parentIds = feedEntries.map((extract) => extract.id).join(',');

	const fetchChildOptions = {
		filterByFormula: `AND(parent, FIND(ARRAYJOIN(parentId), '${parentIds}') > 0)`
	};
	const childExtracts = await airtableFetch<IBaseExtract>(Table.Extracts, fetchChildOptions);
	const entryChildren = childExtracts.map(mapExtractRecord);

	const responseBody = xmlFormatter(atom(feedEntries, entryChildren), {
		collapseContent: true
	});
	const responseOptions = {
		status: 200,
		headers: {
			'Content-Type': 'application/atom+xml',
			'Cache-Control': `max-age=0, s-maxage=0`
		}
	};

	return new Response(responseBody, responseOptions);
}
