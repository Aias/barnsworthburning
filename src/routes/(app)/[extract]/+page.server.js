import { error } from '@sveltejs/kit';
import { airtableFetch } from '$lib/server/requests';
import { mapExtract } from '$schema';

export async function load({ params }) {
	const { extract } = params;

	const filterString = `OR(id = '${extract}', parentId = '${extract}')`;

	const records = await airtableFetch('extracts', {
		filterByFormula: filterString
	});

	if (!records) {
		error(404, {
        			message: 'Failed to load extract.'
        		});
		return null;
	}

	return {
		extracts: records.map(mapExtract),
		currentId: extract
	};
}
