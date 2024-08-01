import { json } from '@sveltejs/kit';
import { airtableFetch } from '$lib/server/requests';
import { mapExtractRecord } from '$helpers/mapping';
import { Table, type IBaseExtract, ExtractView, extractFields } from '$types/Airtable';

export async function GET({ params }) {
	const extracts = await airtableFetch<IBaseExtract>(Table.Extracts, {
		filterByFormula: `FIND('${params.id}', creatorsLookup) > 0`,
		view: ExtractView.Works,
		fields: extractFields
	});

	return json(extracts.map(mapExtractRecord));
}
