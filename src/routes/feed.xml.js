// Modeled after https://github.com/kball/speakwritelisten.com/blob/master/src/routes/feed.xml.js
// and https://github.com/kball/speakwritelisten.com/blob/master/src/routes/index.svelte

import Extract from '../components/Extract.svelte';

import multiJoin from '../helpers/multiJoin';
import { airtableFetch } from './_requests';
import slugify from '../helpers/slugify';
import mapConnections from '../helpers/mapConnections';
import { article } from '../helpers/isFirstLetterAVowel';

const generateLink = (creators = [], spaces = ['design']) => {
	if (creators.length > 0) {
		return `creators/${slugify(creators[0])}`;
	} else {
		return `spaces/${mapConnections(spaces)[0]}`;
	}
};

const meta = {
	title: 'barnsworthburning',
	description: 'A commonplace book.',
	author: {
		name: 'Nick Trombley',
		email: 'trombley.nick@gmail.com',
		url: 'https://nicktrombley.design'
	},
	tags: ['design', 'knowledge', 'making'],
	url: 'https://barnsworthburning.net'
};

const atom = (recentWorks, extracts = []) => {
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
        <url>${meta.author.url}</url>
    </author>
    <updated>${(() => {
		const mostRecentWork = recentWorks[0];
		return new Date(mostRecentWork['last_updated']).toISOString();
	})()}</updated>${meta.tags
		.map(
			(tag) => `
    <category term="${tag}" />`
		)
		.join('')}
${recentWorks
	.map(
		({
			title,
			type,
			combined_creator_names,
			source,
			extract,
			notes,
			slug,
			last_updated,
			extracted_on,
			michelin_stars,
			combined_space_topics = ['design'],
			extract_image,
			image_caption
		}) => {
			return `    <entry>
        <id>${meta.url}/works/${slug}</id>
        <title><![CDATA[${title}]]></title>${
				combined_creator_names
					? combined_creator_names.map(
							(creator) => `
        <author>
            <name><![CDATA[${creator}]]></name>
        </author>`
					  )
					: ''
			}
        <summary><![CDATA[${article(type)} ${type.toLowerCase()}${
				combined_creator_names ? ` by ${multiJoin(combined_creator_names)}` : ''
			}.]]></summary>
        <published>${new Date(extracted_on).toISOString()}</published>
        <updated>${new Date(last_updated).toISOString()}</updated>
        <link rel="alternate" href="${meta.url}/${generateLink(
				combined_creator_names,
				combined_space_topics
			)}/${slug}" />${
				source
					? `
        <link rel="via" href="${source}" />`
					: ''
			}
        <content><![CDATA[
			${
				Extract.render({
					extract: {
						type,
						combined_creator_names,
						source,
						extract,
						notes,
						slug,
						last_updated,
						extracted_on,
						michelin_stars,
						is_work: true,
						extract_image,
						image_caption
					},
					fromRssFeed: true
				}).html
			}
			${(() => {
				const workExtracts = extracts.filter((e) => e.parent_slug[0] === slug);
				return workExtracts
					.map((extract) => {
						const { html } = Extract.render({
							extract,
							suppressCitation: true,
							fromRssFeed: true
						});
						return html;
					})
					.join('\n');
			})()}]]></content>
    </entry>`;
		}
	)
	.join('\n')}
</feed>`;
};

export async function get() {
	const workOptions = {
		view: 'Works',
		maxRecords: 30,
		fields: [
			'title',
			'type',
			'slug',
			'creators',
			'combined_creator_names',
			'num_children',
			'source',
			'extract',
			'notes',
			'extracted_on',
			'last_updated',
			'spaces',
			'combined_space_topics',
			'michelin_stars',
			'extract_image',
			'image_caption'
		],
		filterByFormula: `last_updated < DATEADD(NOW(), -2, 'hour')`
	};

	const works = await airtableFetch('extracts', workOptions);

	if (!works || works.length === 0) {
		return null;
	}

	const workSlugs = works.map((w) => w.slug);
	const slugString = `,${workSlugs.join(',')},`;

	let extractOptions = {
		filterByFormula: `IF(FIND(CONCATENATE(',', {parent_slug}, ','), '${slugString}') > 0, TRUE(), FALSE())`,
		fields: [
			'title',
			'extract',
			'notes',
			'extracted_on',
			'creators',
			'creator_names',
			'slug',
			'parent_slug',
			'parent_title',
			'extract_image',
			'image_caption'
		]
	};

	const extracts = await airtableFetch('extracts', extractOptions);

	return {
		status: 200,
		headers: {
			'Content-Type': 'application/atom+xml',
			'Cache-Control': `max-age=0, s-max-age=${3600}`
		},
		body: atom(works, extracts)
	};
}
