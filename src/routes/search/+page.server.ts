import { error } from '@sveltejs/kit';
import { airtableFetch } from '$lib/server/requests';
import { mapExtractRecord } from '$helpers/mapping';
import { extractFields, ExtractView, type IBaseExtract, Table } from '$types/Airtable';

const MAX_RECORDS = 200;

export async function load({ url }) {
	const queryParam = url.searchParams.get('q');
	if (!queryParam) {
		return {
			search: undefined
		};
	}
	const query = decodeURIComponent(queryParam).toLowerCase().replace(/'/g, "\\'");

	const extractResults = await airtableFetch<IBaseExtract>(Table.Extracts, {
		view: ExtractView.Best,
		maxRecords: MAX_RECORDS,
		filterByFormula: `FIND('${query}', search) > 0`,
		fields: extractFields
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
