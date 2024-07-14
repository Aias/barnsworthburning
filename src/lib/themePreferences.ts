// Adapted from: https://chriscoyier.net/2023/01/19/dark-mode-via-a-smallish-script-in-the-head-avoiding-fart/

import { getCookie } from '../helpers/cookies';
import { Mode, Chroma, Palette } from '../types/Theme';

export const MODE_COOKIE = 'barnsworthburning-mode';
export const DEFAULT_MODE = Mode.Auto;
export const CHROMA_COOKIE = 'barnsworthburning-chroma';
export const DEFAULT_CHROMA = Chroma.Neutral;
export const PALETTE_COOKIE = 'barnsworthburning-palette';
export const DEFAULT_PALETTE = Palette.Indigo;

export const setupPreferences = () => {
	const siteModePreference = getCookie(MODE_COOKIE);
	const siteChromaPreference = getCookie(CHROMA_COOKIE);
	const sitePalettePreference = getCookie(PALETTE_COOKIE);

	if (siteModePreference) {
		document.documentElement.classList.add(siteModePreference);
	} else {
		document.documentElement.classList.add(DEFAULT_MODE);
	}

	if (siteChromaPreference) {
		document.documentElement.classList.add(siteChromaPreference);
	} else {
		document.documentElement.classList.add(DEFAULT_CHROMA);
	}

	if (sitePalettePreference) {
		document.documentElement.classList.add(sitePalettePreference);
	} else {
		document.documentElement.classList.add(DEFAULT_PALETTE);
	}
};
