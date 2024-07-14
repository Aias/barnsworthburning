import { json } from '@sveltejs/kit';
import { airtableFind } from '$lib/server/requests';
import { mapCreatorRecord } from '$helpers/mapping';
import { Table, type IBaseCreator } from '$types/Airtable';

export async function GET({ params }) {
	const creator = await airtableFind<IBaseCreator>(Table.Creators, params.id);
	return json(mapCreatorRecord(creator));
}
