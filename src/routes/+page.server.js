import { airtableFetch } from '$lib/server/requests';

export async function load() {
	const results = await Promise.all([
		airtableFetch('creators', {
			fields: [
				'full_name',
				'last_name',
				'extracts',
				'spaces',
				'last_updated',
				'connections_last_updated',
				'slug',
				'num_extracts',
				'num_fragments'
			],
			view: 'By Count',
			maxRecords: 200
		}),
		airtableFetch('spaces', {
			fields: ['topic', 'extracts', 'creators', 'last_updated', 'connections_last_updated'],
			view: 'By Count',
			maxRecords: 200
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
