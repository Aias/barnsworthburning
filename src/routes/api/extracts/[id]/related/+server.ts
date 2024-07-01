import { json } from '@sveltejs/kit';
import { airtableFind, airtableFetch } from '$lib/server/requests';
import { mapExtractRecord } from '$helpers/mapping';
import { Table, type IBaseExtract, ExtractView } from '$types/Airtable';

export async function GET({ params }) {
	const extract = await airtableFind<IBaseExtract>(Table.Extracts, params.id);

	const relatedIds = [
		...(extract.parent || []),
		...(extract.children || []),
		...(extract.connections || [])
	];

	const relatedExtracts = await airtableFetch<IBaseExtract>(Table.Extracts, {
		filterByFormula: `OR(${relatedIds.map((id) => `RECORD_ID() = '${id}'`).join(',')})`,
		view: ExtractView.Best
	});

	return json(relatedExtracts.map(mapExtractRecord));
}
