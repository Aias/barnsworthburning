import { portfolio } from '../src/_airtable';

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
