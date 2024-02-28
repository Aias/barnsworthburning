import { error } from '@sveltejs/kit';
import { airtableFetch } from '$lib/server/requests';
import { mapExtractRecord } from '$helpers/mapping';
import { decodeTrail, entityTypes } from '$helpers/params';
import type { IBaseExtract } from '$types/Airtable';

const makeCreatorFilter = (id: string) => `FIND('${id}', creatorsLookup)  > 0`;
const makeSpaceFilter = (id: string) => `FIND('${id}', spacesLookup)  > 0`;

export async function load({ params }) {
	const { trail } = params;
	const segments = decodeTrail(trail);
	const { entityType, id } = segments[0];

	let filterFormula;

	switch (entityType) {
		case entityTypes.creator:
			filterFormula = makeCreatorFilter(id);
			break;
		case entityTypes.space:
			filterFormula = makeSpaceFilter(id);
			break;
		case entityTypes.format:
			filterFormula = `format = '${id}'`;
			break;
		case entityTypes.extract:
			filterFormula = `RECORD_ID() = '${id}'`;
			break;
		default:
			error(404, {
				message: 'Invalid trail.'
			});
	}

	const records = await airtableFetch<IBaseExtract>('extracts', {
		view: 'viwCvae2rXQscUap6', // Best
		filterByFormula: filterFormula,
		maxRecords: 300
	});

	if (!records) {
		error(404, {
			message: 'Failed to load records.'
		});
	}

	return {
		[id]: records.map(mapExtractRecord)
	};
}
