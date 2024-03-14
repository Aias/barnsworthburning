import { error } from '@sveltejs/kit';
import { airtableFetch } from '$lib/server/requests';
import { mapCreatorRecord, mapExtractRecord, mapSpaceRecord } from '$helpers/mapping';
import {
	CreatorViews,
	ExtractViews,
	SpaceViews,
	AirtableTables,
	type IBaseCreator,
	type IBaseExtract,
	type IBaseSpace
} from '$types/Airtable';

const MAX_RECORDS = 100;

export async function load() {
	const extracts = await airtableFetch<IBaseExtract>(AirtableTables.Extracts, {
		view: ExtractViews.Works,
		maxRecords: MAX_RECORDS
	});
	const creators = await airtableFetch<IBaseCreator>(AirtableTables.Creators, {
		view: CreatorViews.ByStars,
		maxRecords: MAX_RECORDS
	});
	const spaces = await airtableFetch<IBaseSpace>(AirtableTables.Spaces, {
		view: SpaceViews.ByStars,
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
