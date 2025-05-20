import { createApi } from '$lib/api';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch, locals }) => {
	const api = createApi(fetch);

	const [creators, spaces] = await Promise.all([api.creators.list(), api.spaces.list()]);

	return {
		creators,
		spaces,
		extracts: undefined,
		theme: locals.theme
	};
};
