import { error } from '@sveltejs/kit';
import { airtableFetch, airtableFind } from '$lib/server/requests';
import { mapExtractRecord } from '$helpers/mapping';

export async function load({ params }) {
	const { id } = params;
	const filterExtractsByCreatorId = `FIND('${id}', allCreatorIds)  > 0`;
	const records = await airtableFetch('extracts', {
		view: 'viwCvae2rXQscUap6', // Best
		filterByFormula: filterExtractsByCreatorId,
		maxRecords: 200
	});

	if (!records) {
		error(404, {
			message: 'Failed to load extract.'
		});
		return null;
	}

	return {
		page: records.map(mapExtractRecord)
	};
}
