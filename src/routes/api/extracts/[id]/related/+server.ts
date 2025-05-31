import { cachedJson } from '$helpers/cache';
import { airtableFetch } from '$lib/server/requests';
import { mapExtractRecord } from '$helpers/mapping';
import { Table, type IBaseExtract, ExtractView, extractFields } from '$types/Airtable';

export async function GET({ params }) {
	const { id } = params;
	const filterFormula = `FIND('${id}', extractsLookup) > 0`;
	const extracts = await airtableFetch<IBaseExtract>(Table.Extracts, {
		view: ExtractView.ByEntryDate,
		filterByFormula: filterFormula,
		fields: extractFields
	});

	return cachedJson(extracts.map(mapExtractRecord), 'entityList');
}
