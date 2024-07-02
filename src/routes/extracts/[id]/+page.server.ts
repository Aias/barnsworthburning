import { createApi } from '$lib/api.js';

export async function load({ params, fetch }) {
	const api = createApi(fetch);
	const { id } = params;
	const records = await api.extracts.related(id);

	return {
		selectedExtractData: records
	};
}
