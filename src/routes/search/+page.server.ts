import { error } from '@sveltejs/kit';
import { airtableFetch } from '$lib/server/requests';
import { mapExtractRecord } from '$helpers/mapping';
import { ExtractViews, type IBaseExtract } from '$types/Airtable';

const MAX_RECORDS = 200;

export async function load({ url }) {
	const queryParam = url.searchParams.get('q');
	if (!queryParam) {
		return null;
	}
	const query = decodeURIComponent(queryParam).toLowerCase();

	const extractResults = await airtableFetch<IBaseExtract>('extracts', {
		view: ExtractViews.Best,
		maxRecords: MAX_RECORDS,
		filterByFormula: `FIND('${query}', search) > 0`
	});

	if (!extractResults) {
		error(404, {
			message: 'No results found.'
		});
	}

	return {
		search: extractResults.map(mapExtractRecord)
	};
}
