import { error, json } from '@sveltejs/kit';
import { airtableFetch, airtableFind } from '$lib/server/requests.js';
import { mapExtract, mapSpace, mapCreator } from '$helpers/mapping.js';

export async function GET({ params }) {
	const id = params?.id;
	if (!id) {
		error(404, {
        			message: 'Missing search query.'
        		});
	}

	const extractFilter = `FIND('${id}', ARRAYJOIN(spaceIds, ',')) > 0`;
	const spaceFilter = `FIND('${id}', ARRAYJOIN(spaceIds, ',')) > 0`;
	const creatorFilter = `FIND('${id}', ARRAYJOIN(creatorIds, ',')) > 0`;

	const results = await Promise.all([
		airtableFetch('extracts', {
			filterByFormula: extractFilter
		}),
		airtableFetch('spaces', {
			filterByFormula: spaceFilter
		}),
		airtableFetch('creators', {
			filterByFormula: creatorFilter
		})
	]);

	const extracts = results[0];
	const spaces = results[1];
	const creators = results[2];

	const data = {
		extracts: extracts?.map(mapExtract),
		spaces: spaces?.map(mapSpace),
		creators: creators?.map(mapSpace)
	};

	return json(data);
}
