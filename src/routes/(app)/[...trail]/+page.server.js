import { error } from '@sveltejs/kit';
import { airtableFetch, airtableFind } from '$lib/server/requests';
import { mapExtractRecord } from '$helpers/mapping';
import { decodeId } from '$helpers/params';

const makeCreatorFilter = (id) => `FIND('${id}', creatorsLookup)  > 0`;
const makeSpaceFilter = (id) => `FIND('${id}', spacesLookup)  > 0`;

export async function load({ params }) {
	const { trail } = params;
	const steps = trail.split('/').map((id) => decodeId(id));
	const { id, type } = steps[0];

	let filterFormula;

	switch (type) {
		case 'creator':
			filterFormula = makeCreatorFilter(id);
			break;
		case 'space':
			filterFormula = makeSpaceFilter(id);
			break;
		case 'type':
			filterFormula = `type = '${id}'`;
			break;
		default:
			error(404, {
				message: 'Invalid trail.'
			});
			return null;
	}

	const records = await airtableFetch('extracts', {
		view: 'viwCvae2rXQscUap6', // Best
		filterByFormula: filterFormula,
		maxRecords: 300
	});

	if (!records) {
		error(404, {
			message: 'Failed to load extract.'
		});
		return null;
	}

	return {
		[id]: records.map(mapExtractRecord)
	};
}
