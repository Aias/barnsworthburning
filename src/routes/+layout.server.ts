import { getIndexEntries } from '$lib/server/records';
import { getThemeFromCookies } from '$lib/theme/server';

export async function load({ cookies }) {
	const indexEntries = await getIndexEntries();
	const theme = getThemeFromCookies(cookies);

	return {
		indexEntries,
		theme
	};
}
