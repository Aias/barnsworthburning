import { cachedJson } from '$helpers/cache';
import { airtableFetch } from '$lib/server/requests';
import { mapExtractRecord } from '$helpers/mapping';
import { Table, type IBaseExtract, ExtractView, extractFields } from '$types/Airtable';

export async function GET() {
	const extracts = await airtableFetch<IBaseExtract>(Table.Extracts, {
		view: ExtractView.Feed,
		maxRecords: 100,
		fields: extractFields
	});

	return cachedJson(extracts.map(mapExtractRecord), 'entityList');
}
