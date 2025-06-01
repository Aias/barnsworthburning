import { THEME_CONFIG } from './config';
import type { Cookies } from '@sveltejs/kit';
import type { Mode, Chroma, Palette } from '../../types/Theme';

export interface ThemeState {
	mode: Mode;
	chroma: Chroma;
	palette: Palette;
}

export function getThemeFromCookies(cookies: Cookies): ThemeState {
	return {
		mode: (cookies.get(THEME_CONFIG.cookies.mode) as Mode) || THEME_CONFIG.defaults.mode,
		chroma: (cookies.get(THEME_CONFIG.cookies.chroma) as Chroma) || THEME_CONFIG.defaults.chroma,
		palette: (cookies.get(THEME_CONFIG.cookies.palette) as Palette) || THEME_CONFIG.defaults.palette
	};
}

export function getThemeClasses(theme: ThemeState): string {
	return `${theme.mode} ${theme.chroma} ${theme.palette}`;
}
