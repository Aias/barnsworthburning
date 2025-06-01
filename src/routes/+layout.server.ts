import { createApi } from '$lib/api';
import { getThemeFromCookies } from '$lib/theme/server';

export async function load({ fetch, cookies }) {
	const api = createApi(fetch);

	const [creators, spaces] = await Promise.all([api.creators.list(), api.spaces.list()]);

	const theme = getThemeFromCookies(cookies);

	return {
		creators,
		spaces,
		extracts: undefined,
		theme
	};
}
