import { error } from '@sveltejs/kit';
import { airtableFetch } from '$lib/server/requests';
import { mapExtractRecord } from '$helpers/mapping';
import type { RawExtract } from '$types/Extract';

const MAX_RECORDS = 100;

export async function load() {
	const records = (await airtableFetch('extracts', {
		view: 'viwTkCBV6uRoHplvP', // Works
		sort: [{ field: 'extractedOn', direction: 'desc' }],
		maxRecords: MAX_RECORDS
	})) as RawExtract[];

	if (!records) {
		error(404, {
			message: 'Failed to load extract.'
		});
	}

	return {
		index: records.map(mapExtractRecord)
	};
}
