import { json } from '@sveltejs/kit';
import { airtableFetch } from '$lib/server/requests';
import { mapExtractRecord } from '$helpers/mapping';
import { extractFields, ExtractView, type IBaseExtract, Table } from '$types/Airtable';

const MAX_RECORDS = 200;

export const GET = async ({ url }) => {
	const queryParam = url.searchParams.get('q');

	if (!queryParam) {
		return json({ search: undefined });
	}

	const query = decodeURIComponent(queryParam).toLowerCase().replace(/'/g, "\\'");

	const extractResults = await airtableFetch<IBaseExtract>(Table.Extracts, {
		view: ExtractView.Best,
		maxRecords: MAX_RECORDS,
		filterByFormula: `FIND('${query}', search) > 0`,
		fields: extractFields
	});

	if (!extractResults) {
		return json({ search: [] }, { status: 404 });
	}

	const results = extractResults.map(mapExtractRecord);

	return json({
		results
	});
};
