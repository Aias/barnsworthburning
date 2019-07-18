import { patterns } from '../src/_airtable';
import isEmpty from 'lodash/isEmpty';

export function handler(event, context, callback) {
	const { table } = event.queryStringParameters;
	let data = {};
	let currentPage = 0;

	patterns(table)
		.select({
			view: 'Grid view'
		})
		.eachPage(
			(records, fetchNextPage) => {
				records.forEach((r, i) => {
					data[r.id] = {
						position: i + currentPage * 100,
						...r.fields
					};
				});

				currentPage++;
				fetchNextPage();
			},
			err => {
				if (err) {
					callback(err, {
						statusCode: 500,
						body: 'Internal server error'
					});
				} else if (!isEmpty(data)) {
					callback(null, {
						statusCode: 200,
						body: JSON.stringify(data)
					});
				} else {
					callback(null, {
						statusCode: 404,
						body: 'Table not found'
					});
				}
			}
		);
}
