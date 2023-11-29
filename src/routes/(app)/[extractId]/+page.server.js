import { airtableFetch } from '$lib/server/requests';
import { mapExtract } from '$helpers/mapping.js';

export async function load({ params }) {
	const { extractId } = params;

	const filterString = `OR(id = '${extractId}', parentId = '${extractId}')`;

	const records = await airtableFetch('extracts', {
		filterByFormula: filterString
	});

	if (records) {
		return {
			extracts: records.map(mapExtract),
			currentId: extractId
		};
	} else {
		return {
			error: 'Failed to fetch'
		};
	}
}
