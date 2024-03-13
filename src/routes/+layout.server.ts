import { error } from '@sveltejs/kit';
import { airtableFetch } from '$lib/server/requests';
import { mapCreatorRecord, mapExtractRecord } from '$helpers/mapping';
import {
	CreatorViews,
	ExtractViews,
	SpaceViews,
	type IBaseCreator,
	type IBaseExtract,
	type IBaseSpace
} from '$types/Airtable';

const MAX_RECORDS = 100;

export async function load() {
	const extracts = await airtableFetch<IBaseExtract>('extracts', {
		view: ExtractViews.Works,
		sort: [{ field: 'extractedOn', direction: 'desc' }],
		maxRecords: MAX_RECORDS
	});
	const creators = await airtableFetch<IBaseCreator>('creators', {
		view: CreatorViews.ByStars,
		maxRecords: MAX_RECORDS
	});
	const spaces = await airtableFetch<IBaseSpace>('spaces', {
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
		spaces: spaces
	};
}
