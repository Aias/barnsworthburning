import { createApi } from '$lib/api.js';

export async function load({ fetch }) {
	const api = createApi(fetch);

	const [creators, spaces] = await Promise.all([
		api.creators.list(),
		api.spaces.list()
		// api.extracts.list(),
	]);

	return {
		creators,
		spaces,
		extracts: undefined
	};
}
