import { error } from '@sveltejs/kit';
import { airtableFetch } from '$lib/server/requests';
import { mapSpaceRecord } from '$helpers/mapping';
import { SpaceView, Table, type IBaseSpace } from '$types/Airtable';

const MAX_RECORDS = 100;

export async function load() {
	const creators = await airtableFetch<IBaseSpace>(Table.Spaces, {
		view: SpaceView.RecentlyUpdated,
		filterByFormula: 'numExtracts > 0',
		maxRecords: MAX_RECORDS
	});

	if (!creators) {
		error(404, {
			message: 'Failed to load spaces.'
		});
	}

	return {
		recentSpaces: creators.map(mapSpaceRecord)
	};
}
