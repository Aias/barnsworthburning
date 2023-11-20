import { airtableFetch } from '$lib/server/requests';

const MAX_RECORDS = 200;

export async function load() {
	const results = await Promise.all([
		airtableFetch('creators', {
			fields: ['name', 'numExtracts', 'lastUpdated', 'sortAsIs'],
			view: 'By Count',
			maxRecords: MAX_RECORDS
		}),
		airtableFetch('spaces', {
			fields: ['topic', 'numExtracts', 'lastUpdated'],
			view: 'By Count',
			maxRecords: MAX_RECORDS
		})
	]);
	if (results) {
		return {
			creators: results[0],
			spaces: results[1]
		};
	} else {
		return {
			error: 'Failed to fetch records.'
		};
	}
}
