import { createApi } from '$lib/api.js';

export async function load({ params, fetch }) {
	const api = createApi(fetch);
	const { extractId } = params;
	const records = await api.extracts.related(extractId);

	return {
		selectedExtractData: records
	};
}
