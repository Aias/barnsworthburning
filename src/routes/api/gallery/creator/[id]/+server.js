import { error, json } from '@sveltejs/kit';
import { airtableFetch, airtableFind } from '$lib/server/requests.js';
import { mapExtract, mapCreator } from '$helpers/mapping.js';

export async function GET({ params }) {
	const id = params?.id;
	if (!id) {
		error(404, {
        			message: 'Missing creator ID.'
        		});
	}

	const extractFilter = `FIND('${id}', ARRAYJOIN(creatorIds, ',')) > 0`;

	const results = await Promise.all([
		airtableFind('creators', id),
		airtableFetch('extracts', {
			filterByFormula: extractFilter
		})
	]);

	const creator = results[0];
	const extracts = results[1];

	if (!creator) {
		error(404, {
        			message: 'Unknown creator.'
        		});
	}

	const data = {
		creator: mapCreator(creator),
		gallery: extracts?.map(mapExtract)
	};

	return json(data);
}
