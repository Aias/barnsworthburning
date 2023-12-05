import { error } from '@sveltejs/kit';
import { airtableFetch, airtableFind } from '$lib/server/requests.js';
import { mapExtract, mapSpace } from '$helpers/mapping.js';

export async function GET({ params }) {
	const id = params?.id;
	if (!id) {
		throw error(404, {
			message: 'Missing space ID.'
		});
	}

	const extractFilter = `FIND('${id}', ARRAYJOIN(spaceIds, ',')) > 0`;

	const results = await Promise.all([
		airtableFind('spaces', id),
		airtableFetch('extracts', {
			filterByFormula: extractFilter
		})
	]);

	const space = results[0];
	const extracts = results[1];

	if (!space) {
		throw error(404, {
			message: 'Unknown space.'
		});
	}

	const data = {
		space: mapSpace(space),
		gallery: extracts?.map(mapExtract)
	};

	return new Response(JSON.stringify(data));
}
