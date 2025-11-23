import { createApi } from '$lib/api';
import { getThemeFromCookies } from '$lib/theme/server';
import { getIndex } from './index.remote';

export async function load({ fetch, cookies }) {
	const api = createApi(fetch);
	const index = await getIndex();

	const [creators, spaces] = await Promise.all([api.creators.list(), api.spaces.list()]);

	const theme = getThemeFromCookies(cookies);

	return {
		index,
		creators,
		spaces,
		extracts: undefined,
		theme
	};
}
