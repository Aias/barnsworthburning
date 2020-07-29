// Modeled after https://github.com/kball/speakwritelisten.com/blob/master/src/routes/feed.xml.js
// and https://github.com/kball/speakwritelisten.com/blob/master/src/routes/index.svelte

require('svelte/register');

import Extract from '../components/Extract.svelte';

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
	},
	tags: ['design', 'knowledge', 'making']
};

const atom = (recentWorks, extracts = []) => {
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
    <updated>${(() => {
		const mostRecentWork = recentWorks[0];
		return new Date(mostRecentWork['extracts_last_updated']).toISOString();
	})()}</updated>${meta.tags
		.map(
			(tag) => `
    <category term="${tag}" />`
		)
		.join('')}
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
        <content><![CDATA[
			<p>
				<em>${article(type)} ${type.toLowerCase()} by ${multiJoin(creator_names)}.</em>
				${source_url ? `<a href="${source_url}">Source</a>` : ''}
			</p>
			${(() => {
				const workExtracts = extracts.filter((e) => e.work_slug[0] === slug);
				return workExtracts
					.map((extract) => {
						const { html } = Extract.render({
							extract,
							listed: true
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

export async function get(req, res, next) {
	const workOptions = {
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

	const works = await fetch(
		`${FULL_API}/airtableGet?base=commonplace&table=works&options=${JSON.stringify(workOptions)}`
	)
		.then((data) => data.json())
		.catch((error) => {
			console.log(error);
			return [];
		});

	if (!works || works.length === 0) {
		next();
		return null;
	}

	const workSlugs = works.map((w) => w.slug);
	const slugString = `,${workSlugs.join(',')},`;

	let extractOptions = {
		filterByFormula: `IF(FIND(CONCATENATE(',', {work_slug}, ','), '${slugString}') > 0, TRUE(), FALSE())`,
		fields: [
			'title',
			'extract_text',
			'notes',
			'extracted_on',
			'creator',
			'creator_name',
			'work_slug',
			'work_name',
			'extract_image',
			'image_caption'
		]
	};

	const extracts = await fetch(
		`${FULL_API}/airtableGet?base=commonplace&table=extracts&options=${JSON.stringify(extractOptions)}`
	)
		.then((data) => data.json())
		.catch((error) => {
			console.log(error);
			return [];
		});

	res.setHeader('Content-Type', 'application/atom+xml');
	res.setHeader('Cache-Control', `max-age=0, s-max-age=${3600}`);
	res.end(atom(works, extracts));
}
