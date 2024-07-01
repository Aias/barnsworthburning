import { createApi } from '$lib/api';

export async function load({ fetch }) {
	const api = createApi(fetch);

	const records = await api.extracts.list();

	return {
		recentExtracts: records
	};
}
