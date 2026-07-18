import { getThemeFromCookies, getThemeClasses } from '$lib/theme/server';
import { redirect, type Handle } from '@sveltejs/kit';

const legacySections: Record<string, string> = {
	extracts: 'artifacts',
	creators: 'entities',
	spaces: 'concepts'
};

export const handle: Handle = async ({ event, resolve }) => {
	const [, head] = event.url.pathname.split('/');
	const section = legacySections[head];
	if (section) {
		redirect(301, `/${section}`);
	}

	const theme = getThemeFromCookies(event.cookies);
	const themeClasses = getThemeClasses(theme);

	return resolve(event, {
		transformPageChunk: ({ html }) => {
			return html.replace('%sveltekit.theme%', themeClasses);
		}
	});
};
