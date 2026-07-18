import { getCacheHeaders } from '$helpers/cache';
import { searchRecords } from '$lib/server/records';
import { recordTypes } from '@aias/hozo';

export async function load({ url, setHeaders }) {
	const rawType = url.searchParams.get('type');
	const type = recordTypes.find((recordType) => recordType === rawType);
	const query = url.searchParams.get('q');

	if (!query) {
		return { results: undefined, query: undefined, type };
	}

	setHeaders(getCacheHeaders('search'));
	return {
		results: await searchRecords(query, type),
		query,
		type
	};
}
