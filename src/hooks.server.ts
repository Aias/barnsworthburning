import type { Handle } from '@sveltejs/kit';
import {
	MODE_COOKIE,
	CHROMA_COOKIE,
	PALETTE_COOKIE,
	DEFAULT_MODE,
	DEFAULT_CHROMA,
	DEFAULT_PALETTE,
	Mode,
	Chroma,
	Palette
} from '$types/Theme';

function parseCookies(cookieHeader: string | null): Record<string, string> {
	const result: Record<string, string> = {};
	if (!cookieHeader) return result;
	cookieHeader.split(';').forEach((part) => {
		const [key, ...v] = part.trim().split('=');
		if (!key) return;
		result[key] = decodeURIComponent(v.join('='));
	});
	return result;
}

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = parseCookies(event.request.headers.get('cookie'));
	const mode = (cookies[MODE_COOKIE] as Mode) ?? DEFAULT_MODE;
	const chroma = (cookies[CHROMA_COOKIE] as Chroma) ?? DEFAULT_CHROMA;
	const palette = (cookies[PALETTE_COOKIE] as Palette) ?? DEFAULT_PALETTE;
	const themeClass = [mode, chroma, palette].join(' ');

	event.locals.theme = { mode, chroma, palette, class: themeClass };

	return resolve(event, {
		transformPageChunk: ({ html }) =>
			html
				.replace('<html lang="en">', `<html lang="en" class="${themeClass}">`)
				.replace('<div id="app" class="app">', `<div id="app" class="app ${themeClass}">`)
	});
};
