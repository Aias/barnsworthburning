// Adapted from:
// https://chriscoyier.net/2023/01/19/dark-mode-via-a-smallish-script-in-the-head-avoiding-fart/

const MODE_COOKIE = 'barnsworthburning-mode';
const MODES = {
	DARK: 'dark',
	LIGHT: 'light'
};
const DEFAULT_MODE = MODES.DARK;

const CHROMA_COOKIE = 'barnsworthburning-chroma';
const CHROMA = {
	NEUTRAL: 'neutral',
	CHROMATIC: 'chromatic'
};
const DEFAULT_CHROMA = CHROMA.NEUTRAL;

const PALETTE_COOKIE = 'barnsworthburning-palette';
const DEFAULT_PALETTE = 'indigo';

function getCookie(name) {
	let cookieArr = document.cookie.split(';');
	for (let i = 0; i < cookieArr.length; i++) {
		let cookiePair = cookieArr[i].split('=').map((cookie) => cookie.trim());

		if (name == cookiePair[0]) {
			return decodeURIComponent(cookiePair[1]);
		}
	}
	// Return null if the cookie by name does not exist
	return null;
}

function setCookie(name, value) {
	let expires = 'Fri, 31 Dec 9999 23:59:59 GMT';
	document.cookie = `${name}=${value || ''}; expires=${expires}; path=/`;
}

const siteModePreference = getCookie(MODE_COOKIE);
const siteChromaPreference = getCookie(CHROMA_COOKIE);
const sitePalettePreference = getCookie(PALETTE_COOKIE);

const prefersSystemDarkMode =
	window.matchMedia &&
	(window.matchMedia('(prefers-color-scheme: dark)').matches ||
		window.matchMedia('(prefers-color-scheme: no-preference)').matches);

if (siteModePreference) {
	document.documentElement.classList.add(siteModePreference);
} else if (prefersSystemDarkMode) {
	document.documentElement.classList.add(MODES.DARK);
	setCookie(MODE_COOKIE, MODES.LIGHT);
} else {
	document.documentElement.classList.add(MODES.LIGHT);
	setCookie(MODE_COOKIE, MODES.LIGHT);
}

if (siteChromaPreference) {
	document.documentElement.classList.add(siteChromaPreference);
} else {
	document.documentElement.classList.add(DEFAULT_CHROMA);
	setCookie(CHROMA_COOKIE, DEFAULT_CHROMA);
}

if (sitePalettePreference) {
	document.documentElement.classList.add(sitePalettePreference);
} else {
	document.documentElement.classList.add(DEFAULT_PALETTE);
	setCookie(PALETTE_COOKIE, DEFAULT_PALETTE);
}