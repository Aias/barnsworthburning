import { cachedJson } from '$helpers/cache';
import { airtableFetch } from '$lib/server/requests';
import { mapCreatorRecord } from '$helpers/mapping';
import { Table, type IBaseCreator, CreatorView, creatorFields } from '$types/Airtable';

export async function GET() {
	const creators = await airtableFetch<IBaseCreator>(Table.Creators, {
		view: CreatorView.Best,
		maxRecords: 100,
		fields: creatorFields
	});

	return cachedJson(creators.map(mapCreatorRecord), 'entityList');
}
