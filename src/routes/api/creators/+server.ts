import { json } from '@sveltejs/kit';
import { airtableFetch } from '$lib/server/requests';
import { mapCreatorRecord } from '$helpers/mapping';
import { Table, type IBaseCreator, CreatorView } from '$types/Airtable';

export async function GET() {
	const creators = await airtableFetch<IBaseCreator>(Table.Creators, {
		view: CreatorView.RecentlyUpdated,
		filterByFormula: 'numExtracts > 0',
		maxRecords: 100
	});

	return json(creators.map(mapCreatorRecord));
}
