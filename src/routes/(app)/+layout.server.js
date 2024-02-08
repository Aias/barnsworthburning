import { error } from '@sveltejs/kit';
import { airtableFetch } from '$lib/server/requests';
import { mapExtractRecord } from '../../helpers/mapping';

const MAX_RECORDS = 100;

export async function load() {
	const records = await airtableFetch('extracts', {
		view: 'viwTkCBV6uRoHplvP', // Works
		sort: [{ field: 'extractedOn', direction: 'desc' }],
		maxRecords: MAX_RECORDS
	});

	if (!records) {
		error(404, {
			message: 'Failed to load extract.'
		});
		return null;
	}

	return {
		index: records.map(mapExtractRecord)
	};
}
