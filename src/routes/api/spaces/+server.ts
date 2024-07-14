import { json } from '@sveltejs/kit';
import { airtableFetch } from '$lib/server/requests';
import { mapSpaceRecord } from '$helpers/mapping';
import { Table, type IBaseSpace, SpaceView } from '$types/Airtable';

export async function GET() {
	const spaces = await airtableFetch<IBaseSpace>(Table.Spaces, {
		view: SpaceView.ByCount,
		filterByFormula: 'numExtracts > 0',
		maxRecords: 100
	});

	return json(spaces.map(mapSpaceRecord));
}
