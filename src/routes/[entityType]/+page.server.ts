import { createApi } from '$lib/api';
import { error } from '@sveltejs/kit';

export async function load({ fetch, params }) {
	const api = createApi(fetch);
	const { entityType } = params;

	let creatorsPromise;
	let spacesPromise;
	let extractsPromise;

	switch (entityType) {
		case 'creators':
			creatorsPromise = api.creators.list();
			break;

		case 'spaces':
			spacesPromise = api.spaces.list();
			break;

		case 'extracts':
			extractsPromise = api.extracts.list();
			break;

		default:
			error(500, 'Invalid entity type');
	}

	const [creators, spaces, extracts] = await Promise.all([
		creatorsPromise,
		spacesPromise,
		extractsPromise
	]);

	return {
		recentCreators: creators,
		recentSpaces: spaces,
		recentExtracts: extracts
	};
}
