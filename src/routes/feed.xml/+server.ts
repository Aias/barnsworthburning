// Modeled after https://github.com/kball/speakwritelisten.com/blob/master/src/routes/feed.xml.js
// and https://github.com/kball/speakwritelisten.com/blob/master/src/routes/index.svelte

import { mapExtractRecord } from '$helpers/mapping';
import { airtableFetch } from '$lib/server/requests';
import {
	ExtractView,
	Table,
	type IBaseExtract,
	type IExtract,
	type ILinkedRecord
} from '$types/Airtable';
import markdown from '$helpers/markdown';

const generateCategoryMarkup = (spaces: ILinkedRecord[] = []) => {
	return spaces.map((space) => `<category term="${space.name}" />`).join('');
};
const generateContentMarkup = (extract: IExtract) => {
	const { extract: content } = extract;
	if (content) {
		return markdown.parse(content);
	}
	return 'Open on barnsworthburning.net to view non-text content.';
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
    <updated>${(() => {
		const mostRecentWork = extracts[0];
		return new Date(mostRecentWork['lastUpdated']).toISOString();
	})()}</updated>${meta.tags
		.map(
			(tag) => `
    <category term="${tag}" />`
		)
		.join('')}
${extracts
	.map((extract) => {
		const { title, id, creators, source, lastUpdated, extractedOn, spaces } = extract;
		return `    <entry>
        <id>${meta.url}/extracts/${id}</id>
        <title><![CDATA[${title}]]></title>${
			creators
				? creators
						.map(
							(creator) => `
        <author>
            <name><![CDATA[${creator.name}]]></name>
        </author>`
						)
						.join('')
				: ''
		}
        <published>${new Date(extractedOn).toISOString()}</published>
        <updated>${new Date(lastUpdated).toISOString()}</updated>
        <link rel="alternate" href="${meta.url}/extracts/${id}" />${
			source
				? `
        <link rel="via" href="${cleanLink(source)}" />`
				: ''
		}
        ${generateCategoryMarkup(spaces)}
        <content type="html"><![CDATA[${generateContentMarkup(extract)}]]></content>
    </entry>`;
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

	const responseBody = atom(mappedExtracts);
	const responseOptions = {
		status: 200,
		headers: {
			'Content-Type': 'application/atom+xml',
			'Cache-Control': `max-age=0, s-maxage=${3600}`
		}
	};

	return new Response(responseBody, responseOptions);
}
