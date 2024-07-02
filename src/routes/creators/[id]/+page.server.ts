import { createApi } from '$lib/api';

export async function load({ params, fetch }) {
	const api = createApi(fetch);
	const creatorId = params.id;

	const [creator, extractsByCreator] = await Promise.all([
		api.creators.get(creatorId),
		api.creators.extracts(creatorId)
	]);

	return {
		creator,
		extractsByCreator
	};
}
