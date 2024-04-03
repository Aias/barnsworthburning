import { error } from '@sveltejs/kit';
import { airtableFetch } from '$lib/server/requests';
import { mapCreatorRecord } from '$helpers/mapping';
import { CreatorView, AirtableTable, type IBaseCreator } from '$types/Airtable';

const MAX_RECORDS = 100;

export async function load() {
	const creators = await airtableFetch<IBaseCreator>(AirtableTable.Creators, {
		view: CreatorView.RecentlyUpdated,
		maxRecords: MAX_RECORDS
	});

	if (!creators) {
		error(404, {
			message: 'Failed to load creators.'
		});
	}

	return {
		recentCreators: creators.map(mapCreatorRecord)
	};
}
