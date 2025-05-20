import { createApi } from '$lib/api';
import {
	CHROMA_COOKIE,
	DEFAULT_CHROMA,
	DEFAULT_MODE,
	DEFAULT_PALETTE,
	MODE_COOKIE,
	PALETTE_COOKIE,
	type Chroma,
	type Mode,
	type Palette
} from '$types/Theme';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch, cookies }) => {
	const api = createApi(fetch);

	const mode = (cookies.get(MODE_COOKIE) as Mode | undefined) ?? DEFAULT_MODE;
	const chroma = (cookies.get(CHROMA_COOKIE) as Chroma | undefined) ?? DEFAULT_CHROMA;
	const palette = (cookies.get(PALETTE_COOKIE) as Palette | undefined) ?? DEFAULT_PALETTE;

	const [creators, spaces] = await Promise.all([api.creators.list(), api.spaces.list()]);

	return {
		creators,
		spaces,
		extracts: undefined,
		theme: { mode, chroma, palette }
	};
};
