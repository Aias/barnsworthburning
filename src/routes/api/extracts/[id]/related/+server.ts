import { json } from '@sveltejs/kit';
import { airtableFetch } from '$lib/server/requests';
import { mapExtractRecord } from '$helpers/mapping';
import { Table, type IBaseExtract, ExtractView } from '$types/Airtable';

export async function GET({ params }) {
	const { id } = params;
	const filterFormula = `FIND('${id}', extractsLookup) > 0`;
	const extracts = await airtableFetch<IBaseExtract>(Table.Extracts, {
		view: ExtractView.ByEntryDate,
		filterByFormula: filterFormula
	});

	return json(extracts.map(mapExtractRecord));
}
