import { json } from '@sveltejs/kit';
import { airtableFetch } from '$lib/server/requests';
import { mapSpaceRecord } from '$helpers/mapping';
import { Table, type IBaseSpace, SpaceView, spaceFields } from '$types/Airtable';

export async function GET() {
	const spaces = await airtableFetch<IBaseSpace>(Table.Spaces, {
		view: SpaceView.Best,
		maxRecords: 100,
		fields: spaceFields
	});

	return json(spaces.map(mapSpaceRecord));
}
