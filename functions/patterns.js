import { patterns } from '../src/_airtable';
import isEmpty from 'lodash/isEmpty';

export async function get(req, res, next) {
	const { table } = req.params;
	let data = {};
	let currentPage = 0;

	patterns(table)
		.select({
			view: 'Grid view'
		})
		.eachPage(
			function page(records, fetchNextPage) {
				records.forEach((r, i) => {
					data[r.id] = {
						position: i + currentPage * 100,
						...r.fields
					};
				});

				currentPage++;
				fetchNextPage();
			},
			function done(err) {
				if (err) {
					res.writeHead(500, {
						'Content-Type': 'application/json'
					});
					res.end(
						JSON.stringify({
							message: `Internal server error`,
							error: err
						})
					);
				} else if (!isEmpty(data)) {
					res.writeHead(200, {
						'Content-Type': 'application/json'
					});
					res.end(JSON.stringify(data));
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
