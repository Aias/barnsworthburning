import { json } from '@sveltejs/kit';
import { airtableFind } from '$lib/server/requests';
import { mapSpaceRecord } from '$helpers/mapping';
import { Table, type IBaseSpace } from '$types/Airtable';

export async function GET({ params }) {
	const space = await airtableFind<IBaseSpace>(Table.Spaces, params.id);
	return json(mapSpaceRecord(space));
}
