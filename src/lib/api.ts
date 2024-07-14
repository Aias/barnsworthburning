import type { IExtract, ICreator, ISpace } from '$types/Airtable';
import { error } from '@sveltejs/kit';

type FetchFunction = typeof fetch;

function createApi(customFetch: FetchFunction) {
	async function fetchJson<T>(url: string): Promise<T> {
		const response = await customFetch(url);
		if (!response.ok) {
			error(response.status, `Failed to fetch. Status: ${response.status}`);
		}
		return await response.json();
	}

	return {
		extracts: {
			list: () => fetchJson<IExtract[]>('/api/extracts'),
			get: (id: string) => fetchJson<IExtract>(`/api/extracts/${id}`),
			related: (id: string) => fetchJson<IExtract[]>(`/api/extracts/${id}/related`)
		},
		creators: {
			list: () => fetchJson<ICreator[]>('/api/creators'),
			get: (id: string) => fetchJson<ICreator>(`/api/creators/${id}`),
			extracts: (id: string) => fetchJson<IExtract[]>(`/api/creators/${id}/extracts`)
		},
		spaces: {
			list: () => fetchJson<ISpace[]>('/api/spaces'),
			get: (id: string) => fetchJson<ISpace>(`/api/spaces/${id}`),
			extracts: (id: string) => fetchJson<IExtract[]>(`/api/spaces/${id}/extracts`)
		}
	};
}

export const api = createApi(fetch);

export { createApi };
