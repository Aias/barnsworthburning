import { createApi } from '$lib/api';

export async function load({ fetch }) {
	const api = createApi(fetch);

	const [creators, spaces] = await Promise.all([api.creators.list(), api.spaces.list()]);

	return {
		creators,
		spaces,
		extracts: undefined
	};
}
