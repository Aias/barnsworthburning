import { error } from '@sveltejs/kit';
import { airtableFetch } from '$lib/server/requests';
import { mapIndex } from '$helpers/mapping';

const MAX_RECORDS = 200;

export async function load() {
	const results = await Promise.all([
		airtableFetch('creators', {
			fields: ['name', 'numExtracts', 'lastUpdated'],
			view: 'By Count',
			maxRecords: MAX_RECORDS
		}),
		airtableFetch('spaces', {
			fields: ['topic', 'numExtracts', 'lastUpdated'],
			view: 'By Count',
			maxRecords: MAX_RECORDS
		})
	]);
	const [creators, spaces] = results;
	if (!(creators && spaces)) {
		throw error(404, {
			message: 'Failed to build index.'
		});
		return null;
	}

	const index = mapIndex(creators, spaces);
	return { index };
}
