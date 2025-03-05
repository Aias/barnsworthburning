import { error } from '@sveltejs/kit';
import type { IExtract } from '$types/Airtable';

export async function load({ fetch, url }) {
	const queryParam = url.searchParams.get('q');

	if (!queryParam) {
		return {
			results: undefined
		};
	}

	const response = await fetch(`/api/search?q=${encodeURIComponent(queryParam)}`);

	if (!response.ok) {
		error(response.status, {
			message: 'Failed to fetch search results'
		});
	}

	const results = await response.json().then((data) => data.results as IExtract[]);

	return { results };
}
