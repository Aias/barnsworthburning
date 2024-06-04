import { mapExtractRecord } from '$helpers/mapping';
import { airtableFetch } from '$lib/server/requests';
import { ExtractView, Table, type IBaseExtract, type IExtract } from '$types/Airtable';
import markdown from '$helpers/markdown';
import { article } from '$helpers/grammar';
import xmlFormatter from 'xml-formatter';

const generateContentMarkup = (extract: IExtract) => {
	const {
		extract: content,
		notes,
		format,
		source,
		creators = [
			{
				id: 'anon',
				name: 'Anonymous'
			}
		]
	} = extract;
	let type = (format || 'extract').toLowerCase();
	let markup = '<article>\n';
	markup += '<header>\n';
	markup += '<p>';
	markup += `${article(type)} <strong>${type}</strong> by `;
	creators.forEach(({ name, id }, index) => {
		if (index > 0) {
			if (index + 1 < creators.length) {
				markup += ', ';
			} else {
				markup += ' & ';
			}
		}
		markup += `<a href="${meta.url}/creators/${id}">${name}</a>`;
	});
	markup += '</p>\n';
	if (source) {
		markup += `<p>From <a href="${source}">${new URL(source).hostname}</a></p>\n`;
	}
	markup += '</header>\n';
	markup += '<section>\n';
	if (content) {
		markup += '<blockquote>\n';
		markup += markdown.parse(content);
		markup += '</blockquote>\n';
	}
	if (notes) {
		if (content) {
			markup += '<hr />\n';
		}
		markup += markdown.parse(notes);
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
	url: 'https://barnsworthburning.netlify.app'
};

const atom = (extracts: IExtract[] = []) => {
	const feedUpdated = new Date(extracts[0].lastUpdated).toISOString();
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
	${extracts
		.map((extract) => {
			const { title, id, creators, source, lastUpdated, extractedOn, spaces, images } =
				extract;

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
			entry += `<content type="html"><![CDATA[${generateContentMarkup(extract)}]]></content>`;
			entry += '</entry>';
			return entry;
		})
		.join('\n')}
</feed>`;
};

export async function GET() {
	const fetchOptions = {
		view: ExtractView.Works,
		maxRecords: 30,
		filterByFormula: `lastUpdated < DATEADD(NOW(), -12, 'hour')`
	};

	const extracts = await airtableFetch<IBaseExtract>(Table.Extracts, fetchOptions);
	const mappedExtracts = extracts.map(mapExtractRecord);

	const responseBody = xmlFormatter(atom(mappedExtracts), {
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
