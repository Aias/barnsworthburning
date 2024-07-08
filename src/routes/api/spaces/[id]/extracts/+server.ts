import { json } from '@sveltejs/kit';
import { airtableFetch } from '$lib/server/requests';
import { mapExtractRecord } from '$helpers/mapping';
import { Table, type IBaseExtract, ExtractView } from '$types/Airtable';

export async function GET({ params }) {
	const extracts = await airtableFetch<IBaseExtract>(Table.Extracts, {
		filterByFormula: `FIND('${params.id}', spacesLookup) > 0`,
		view: ExtractView.Best
	});

	return json(extracts.map(mapExtractRecord));
}
