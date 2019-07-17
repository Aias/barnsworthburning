// From https://github.com/sveltejs/sapper/issues/461
// and https://github.com/sveltejs/hn.svelte.technology/blob/master/src/routes/%5Blist%5D/rss.js

import { portfolio } from '../../_airtable';

const render = items => `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
	<title>bwb.log</title>
	<link>http://barnsworthburning.net/blog/feed/</link>
	<description>Notes, thoughts, and updates from barnsworthburning.net</description>
	<image>
		<url>https://hn.svelte.technology/favicon.png</url>
		<title>Image title</title>
		<link>https://hn.svelte.technology/1</link>
	</image>
	${items
		.map(
			item => `<item>
		<title>${item.title}</title>
		<link>localhost:3000/blog/posts/${item.id}</link>
		<description>${item.description}</description>
		<pubDate>${new Date(item.created).toUTCString()}</pubDate>
	</item>`
		)
		.join('\n')}
</channel>
</rss>`;

export function get(req, res) {
	portfolio('blog')
		.select({
			maxRecords: 10,
			pageSize: 100,
			view: 'Grid view',
			sort: [{ field: 'created', direction: 'desc' }]
		})
		.firstPage((err, records) => {
			if (err) {
				console.error(err);
				return;
			} else {
				let items = records.map(r => r.fields);
				console.log(items);

				const feed = render(items);
				res.writeHead(200, {
					'Cache-Control': `max-age=0, s-max-age=${600}`, // 10 minutes
					'Content-Type': 'application/rss+xml'
				});
				res.end(feed);
			}
		});
}
