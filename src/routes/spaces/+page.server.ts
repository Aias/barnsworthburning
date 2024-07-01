import { createApi } from '$lib/api';

export async function load({ fetch }) {
	const api = createApi(fetch);

	const records = await api.spaces.list();

	return {
		recentSpaces: records
	};
}
