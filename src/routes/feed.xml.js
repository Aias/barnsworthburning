// Modeled after https://github.com/kball/speakwritelisten.com/blob/master/src/routes/feed.xml.js
// and https://github.com/kball/speakwritelisten.com/blob/master/src/routes/index.svelte

import { SITE_URL, FULL_API } from '../config';
import multiJoin from '../helpers/multiJoin';
import { article } from '../helpers/isFirstLetterAVowel';

import fetch from 'node-fetch';

const meta = {
	title: 'barnsworthburning',
	description: 'A commonplace book.',
	author: {
		name: 'Nick Trombley',
		email: 'trombley.nick@gmail.com',
		url: 'https://nicktrombley.design'
	}
};

// const rss = (recentWorks) => `<?xml version="1.0" encoding="UTF-8" ?>
// <rss version="2.0">
// <channel>
// 	<title><![CDATA[bwb.log]]></title>
// 	<link>${SITE_URL}</link>
// 	<description><![CDATA[Notes, thoughts, and updates from barnsworthburning.net]]></description>
// 	<image>
// 		<url>https://hn.svelte.technology/favicon.png</url>
// 		<title><![CDATA[Image title]]></title>
// 		<link>https://hn.svelte.technology/1</link>
// 	</image>
// 	${recentWorks
// 		.map(
// 			(work) => `<item>
// 		<title><![CDATA[${work.name}]]></title>
// 		<guid>${SITE_URL}/works/${work.slug}</guid>
// 		<link>${SITE_URL}/works/${work.slug}</link>
// 		<description><![CDATA[${work.notes}]]></description>
// 		<pubDate>${new Date(work.created_time).toUTCString()}</pubDate>
// 	</item>`
// 		)
// 		.join('\n')}
// </channel>
// </rss>`;

const atom = (recentWorks) => {
	return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
    <id>${SITE_URL}/feed</id>
    <title>${meta.title}</title>
    <subtitle>${meta.description}</subtitle>
    <link href="${SITE_URL}/feed.xml" rel="self" />
    <link href="${SITE_URL}" />
    <icon>${SITE_URL}/favicon.png</icon>
    <author>
        <name>${meta.author.name}</name>
        <email>${meta.author.email}</email>
        <url>${meta.author.url}</url>
    </author>
    <updated>${new Date().toISOString()}</updated>
${recentWorks
	.map(
		({
			name,
			type,
			creator_names,
			source_url,
			notes,
			slug,
			extracts_last_updated,
			created_time,
			michelin_stars,
			spaces
		}) => {
			return `    <entry>
        <id>${SITE_URL}/works/${slug}</id>
        <title><![CDATA[${name}]]></title>${creator_names.map(
				(creator) => `
        <author>
            <name><![CDATA[${creator}]]></name>
        </author>`
			)}
        <summary><![CDATA[${article(type)} ${type.toLowerCase()} by ${multiJoin(creator_names)}.]]></summary>
        <published>${new Date(created_time).toISOString()}</published>
        <updated>${new Date(extracts_last_updated).toISOString()}</updated>
        <link rel="alternate" href="${SITE_URL}/works/${slug}" />${
				source_url
					? `
        <link rel="via" href="${source_url}" />`
					: ''
			}
    </entry>`;
		}
	)
	.join('\n')}
</feed>`;
};

export async function get(req, res, next) {
	const options = {
		view: 'Recent',
		maxRecords: 30,
		fields: [
			'name',
			'type',
			'slug',
			'creator',
			'creator_names',
			'num_extracts',
			'source_url',
			'notes',
			'created_time',
			'spaces',
			'michelin_stars',
			'extracts_last_updated'
		],
		filterByFormula: 'num_extracts > 0'
	};

	const works = await fetch(`${FULL_API}/airtableGet?base=commonplace&table=works&options=${JSON.stringify(options)}`)
		.then((data) => data.json())
		.catch((error) => {
			console.log(error);
			return [];
		});

	if (works !== null) {
		res.setHeader('Content-Type', 'application/atom+xml');
		res.setHeader('Cache-Control', `max-age=0, s-max-age=${3600}`);
		res.end(atom(works));
	} else {
		next();
	}
}
