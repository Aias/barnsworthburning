// From https://github.com/sveltejs/sapper/issues/461
// and https://github.com/sveltejs/hn.svelte.technology/blob/master/src/routes/%5Blist%5D/rss.js
// and https://lacourt.dev/2019/06/29

import { portfolio } from '../src/_airtable';

const siteUrl = 'https://barnsworthburning.netlify.com';

// TODO: Add an option for Atom.
const renderRssXml = items => `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
	<title><![CDATA[bwb.log]]></title>
	<link>${siteUrl}/blog/</link>
	<description><![CDATA[Notes, thoughts, and updates from barnsworthburning.net]]></description>
	<image>
		<url>https://hn.svelte.technology/favicon.png</url>
		<title><![CDATA[Image title]]></title>
		<link>https://hn.svelte.technology/1</link>
	</image>
	${items
		.map(
			item => `<item>
		<title><![CDATA[${item.title}]]></title>
		<guid>${siteUrl}/blog/${item.slug}</guid>
		<link>${siteUrl}/blog/${item.slug}</link>
		<description><![CDATA[${item.description}]]></description>
		<pubDate>${new Date(item.created).toUTCString()}</pubDate>
	</item>`
		)
		.join('\n')}
</channel>
</rss>`;

export function handler(event, context, callback) {
	portfolio('blog')
		.select({
			maxRecords: 10,
			pageSize: 100,
			view: 'published-posts',
			sort: [{ field: 'created', direction: 'desc' }]
		})
		.firstPage((err, records) => {
			if (err) {
				callback(err);
			} else {
				let items = records.map(r => r.fields);

				const feed = renderRssXml(items);

				callback(null, {
					statusCode: 200,
					headers: {
						'Cache-Control': `max-age=0, s-max-age=${600}`, // 10 minutes
						'Content-Type': 'application/rss+xml'
					},
					body: feed
				});
			}
		});
}
