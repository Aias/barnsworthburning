import { createApi } from '$lib/api';

export async function load({ params, fetch }) {
	const api = createApi(fetch);
	const spaceIds = params.spaceIds?.split('/');

	const spaces = spaceIds.map(async (spaceId) => api.spaces.get(spaceId));
	const extracts = spaceIds.map(async (spaceId) => api.spaces.extracts(spaceId));

	return {
		selectedSpacesData: await Promise.all(spaces),
		extractsInSpaces: (await Promise.all(extracts)).flat()
	};
}
