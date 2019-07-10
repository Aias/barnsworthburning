import Airtable from 'airtable';
import isEmpty from 'lodash/isEmpty';

Airtable.configure({
	endpointUrl: 'https://api.airtable.com',
	apiKey: 'key8N24RInkvmsEgD'
});
var base = Airtable.base('appRtVtmOW4oibIij');

export async function get(req, res, next) {
	let patterns = {};

	base('patterns')
		.select()
		.eachPage(
			function page(records, fetchNextPage) {
				// This function (`page`) will get called for each page of records.

				records.forEach(r => {
					patterns[r.id] = r.fields;
				});

				// To fetch the next page of records, call `fetchNextPage`.
				// If there are more records, `page` will get called again.
				// If there are no more records, `done` will get called.
				fetchNextPage();
			},
			function done(err) {
				if (err) {
					res.writeHead(500, {
						'Content-Type': 'application/json'
					});
					res.end(
						JSON.stringify({
							message: `Internal server error`
						})
					);
				}
				if (!isEmpty(patterns)) {
					res.setHeader('Content-Type', 'application/json');
					res.end(JSON.stringify(patterns));
				} else {
					res.writeHead(404, {
						'Content-Type': 'application/json'
					});
					res.end(
						JSON.stringify({
							message: `Not found`
						})
					);
				}
			}
		);
}
