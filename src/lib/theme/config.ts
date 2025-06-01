import { Mode, Chroma, Palette } from '../../types/Theme';

export const THEME_CONFIG = {
	cookies: {
		mode: 'barnsworthburning-mode',
		chroma: 'barnsworthburning-chroma',
		palette: 'barnsworthburning-palette'
	},
	defaults: {
		mode: Mode.Auto,
		chroma: Chroma.Neutral,
		palette: Palette.Indigo
	},
	storage: {
		mode: { expires: 'Fri, 31 Dec 9999 23:59:59 GMT', path: '/' },
		chroma: { expires: 'Fri, 31 Dec 9999 23:59:59 GMT', path: '/' },
		palette: { expires: 'Fri, 31 Dec 9999 23:59:59 GMT', path: '/' }
	}
} as const;

export type ThemeConfig = typeof THEME_CONFIG;

// Export the defaults for easy access
export const DEFAULT_MODE = THEME_CONFIG.defaults.mode;
export const DEFAULT_CHROMA = THEME_CONFIG.defaults.chroma;
export const DEFAULT_PALETTE = THEME_CONFIG.defaults.palette;
