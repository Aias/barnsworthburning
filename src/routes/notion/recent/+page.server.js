import notion, { databases } from '$lib/server/notion';

export async function load({ params }) {
	const records = await notion.databases.query({
		database_id: databases.extracts
	});

	if (records) {
		return {
			extracts: records.results
		};
	} else {
		return {
			error: 'Failed to fetch'
		};
	}
}
