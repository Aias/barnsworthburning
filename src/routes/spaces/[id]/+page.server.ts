import { createApi } from '$lib/api';

export async function load({ params, fetch }) {
	const api = createApi(fetch);
	const spaceId = params.id;

	const [space, extractsInSpace] = await Promise.all([
		api.spaces.get(spaceId),
		api.spaces.extracts(spaceId)
	]);

	return {
		space,
		extractsInSpace
	};
}
