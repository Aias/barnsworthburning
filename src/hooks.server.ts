import type { Handle } from '@sveltejs/kit';
import { getThemeFromCookies, getThemeClasses } from '$lib/theme/server';

export const handle: Handle = async ({ event, resolve }) => {
	const theme = getThemeFromCookies(event.cookies);
	const themeClasses = getThemeClasses(theme);

	return resolve(event, {
		transformPageChunk: ({ html }) => {
			return html.replace('%sveltekit.theme%', themeClasses);
		}
	});
};
