import { createApi } from '$lib/api';

export async function load({ fetch }) {
	const api = createApi(fetch);

	const creators = await api.creators.list();

	return {
		recentCreators: creators
	};
}
