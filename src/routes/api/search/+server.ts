import { escapeFormulaString } from '$helpers/airtable';
import { cachedJson } from '$helpers/cache';
import { airtableFetch } from '$lib/server/requests';
import { mapExtractRecord } from '$helpers/mapping';
import { extractFields, ExtractView, type IBaseExtract, Table } from '$types/Airtable';

const MAX_RECORDS = 200;

export const GET = async ({ url }) => {
	const queryParam = url.searchParams.get('q');

	if (!queryParam) {
		return cachedJson({ results: [] }, 'search');
	}

	// URLSearchParams.get() already decodes percent-encoded values
	const query = escapeFormulaString(queryParam.toLowerCase());

	const extractResults = await airtableFetch<IBaseExtract>(Table.Extracts, {
		view: ExtractView.Best,
		maxRecords: MAX_RECORDS,
		filterByFormula: `FIND('${query}', search) > 0`,
		fields: extractFields
	});

	if (!extractResults) {
		return cachedJson({ results: [] }, 'search');
	}

	return cachedJson({ results: extractResults.map(mapExtractRecord) }, 'search');
};
