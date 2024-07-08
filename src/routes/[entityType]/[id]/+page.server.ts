import { createApi } from '$lib/api';
import { error } from '@sveltejs/kit';

export async function load({ params, fetch }) {
	const api = createApi(fetch);
	const { id, entityType } = params;

	let creatorPromise;
	let spacePromise;
	let extractsPromise;

	switch (entityType) {
		case 'creators':
			creatorPromise = api.creators.get(id);
			extractsPromise = api.creators.extracts(id);
			break;

		case 'spaces':
			spacePromise = api.spaces.get(id);
			extractsPromise = api.spaces.extracts(id);
			break;

		case 'extracts':
			extractsPromise = api.extracts.related(id);
			break;

		default:
			error(500, 'Invalid entity type');
	}

	const [creator, space, extracts] = await Promise.all([
		creatorPromise,
		spacePromise,
		extractsPromise
	]);

	return {
		creator,
		space,
		extracts
	};
}
