import notion, { databases } from '$lib/server/notion';

export async function load({ params }) {
	const records = await notion.databases.query({
		database_id: databases.creators,
		filter: {
			property: 'Count',
			rollup: {
				number: {
					greater_than: 1
				}
			}
		},
		sorts: [
			{
				property: 'Count',
				direction: 'descending'
			},
			{
				property: 'Last Edited',
				direction: 'descending'
			}
		]
	});

	if (records) {
		return {
			creators: records.results
		};
	} else {
		return {
			error: 'Failed to fetch'
		};
	}
}
