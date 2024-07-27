import { json } from '@sveltejs/kit';
import { airtableFetch } from '$lib/server/requests';
import { mapExtractRecord } from '$helpers/mapping';
import { Table, type IBaseExtract, ExtractView, extractFields } from '$types/Airtable';

export async function GET() {
	const extracts = await airtableFetch<IBaseExtract>(Table.Extracts, {
		view: ExtractView.Works,
		maxRecords: 100,
		fields: extractFields
	});

	return json(extracts.map(mapExtractRecord));
}
