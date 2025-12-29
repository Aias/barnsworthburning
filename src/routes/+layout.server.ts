import { createApi } from '$lib/api';
import { getThemeFromCookies } from '$lib/theme/server';

export async function load({ fetch, cookies }) {
	const api = createApi(fetch);

	const [creators, spaces] = await Promise.allSettled([api.creators.list(), api.spaces.list()]);

	const theme = getThemeFromCookies(cookies);

	return {
		creators: creators.status === 'fulfilled' ? creators.value : [],
		spaces: spaces.status === 'fulfilled' ? spaces.value : [],
		theme
	};
}
