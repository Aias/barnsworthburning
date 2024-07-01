import { createApi } from '$lib/api';

export async function load({ params, fetch }) {
	const api = createApi(fetch);
	const creatorIds = params.creatorIds?.split('/');

	const creators = creatorIds.map(async (creatorId) => api.creators.get(creatorId));
	const extracts = creatorIds.map(async (creatorId) => api.creators.extracts(creatorId));

	return {
		selectedCreatorsData: await Promise.all(creators),
		extractsByCreators: (await Promise.all(extracts)).flat()
	};
}
