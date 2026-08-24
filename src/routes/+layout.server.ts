import { getIndexEntries } from '#lib/server/records.js';
import { getThemeFromCookies } from '#lib/theme/server.js';

export async function load({ cookies }) {
	const indexEntries = await getIndexEntries();
	const theme = getThemeFromCookies(cookies);

	return {
		indexEntries,
		theme
	};
}
