import { error } from '@sveltejs/kit';
import { airtableFetch } from '$lib/server/requests';
import { mapCreatorRecord, mapExtractRecord, mapSpaceRecord } from '$helpers/mapping';
import {
	CreatorView,
	ExtractView,
	SpaceView,
	Table,
	type IBaseCreator,
	type IBaseExtract,
	type IBaseSpace
} from '$types/Airtable';

const MAX_RECORDS = 100;

export async function load() {
	const extracts = await airtableFetch<IBaseExtract>(Table.Extracts, {
		view: ExtractView.Works,
		maxRecords: MAX_RECORDS
	});
	const creators = await airtableFetch<IBaseCreator>(Table.Creators, {
		view: CreatorView.ByStars,
		maxRecords: MAX_RECORDS
	});
	const spaces = await airtableFetch<IBaseSpace>(Table.Spaces, {
		view: SpaceView.ByStars,
		maxRecords: MAX_RECORDS
	});

	if (!extracts) {
		error(404, {
			message: 'Failed to load extract.'
		});
	}

	return {
		extracts: extracts.map(mapExtractRecord),
		creators: creators.map(mapCreatorRecord),
		spaces: spaces.map(mapSpaceRecord)
	};
}
