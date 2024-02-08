import { error } from '@sveltejs/kit';
import { airtableFetch, airtableFind } from '$lib/server/requests';
import { mapExtractRecord } from '$helpers/mapping';

export async function load({ params }) {
	const { trail } = params;
	const ids = trail.split('/');
	const id = ids[0];
	const filterExtractsByCreatorId = `FIND('${id}', allCreatorIds)  > 0`;
	const records = await airtableFetch('extracts', {
		view: 'viwCvae2rXQscUap6', // Best
		filterByFormula: filterExtractsByCreatorId
	});

	if (!records) {
		error(404, {
			message: 'Failed to load extract.'
		});
		return null;
	}

	return {
		[id]: records.map(mapExtractRecord)
	};
}
