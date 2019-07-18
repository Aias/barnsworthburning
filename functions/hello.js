import { portfolio } from '../src/routes/_airtable';

export async function get(req, res) {
	let posts = [];

	portfolio('blog')
		.select({
			// maxRecords: 10,
			// pageSize: 100,
			view: 'published-posts',
			sort: [{ field: 'created', direction: 'desc' }]
		})
		.eachPage(
			(records, fetchNextPage) => {
				records.forEach(r => {
					posts.push(r.fields);
				});
				fetchNextPage();
			},
			err => {
				if (err) {
					res.writeHead(500, 'Internal server error.');
					res.end(JSON.stringify(err));
				} else {
					res.writeHead(200, {
						'Cache-Control': `max-age=0, s-max-age=${600}` // 10 minutes
					});
					res.end(JSON.stringify(posts));
				}
			}
		);
}

// For more info, check https://www.netlify.com/docs/functions/#javascript-lambda-functions
export function handler(event, context, callback) {
	let posts = [];

	portfolio('blog')
		.select({
			// maxRecords: 10,
			// pageSize: 100,
			view: 'published-posts',
			sort: [{ field: 'created', direction: 'desc' }]
		})
		.eachPage(
			(records, fetchNextPage) => {
				records.forEach(r => {
					posts.push(r.fields);
				});
				fetchNextPage();
			},
			err => {
				if (err) {
					callback(err);
				} else {
					callback(null, {
						// return null to show no errors
						statusCode: 200, // http status code
						body: JSON.stringify(posts)
					});
				}
			}
		);
}
