import { setCookie, getCookie } from '$helpers/cookies';
import { paletteOptions, Palette, Chroma, Mode } from '$types/Theme';
import { THEME_CONFIG, DEFAULT_MODE, DEFAULT_CHROMA, DEFAULT_PALETTE } from '$lib/theme/config';

const MODE_COOKIE = THEME_CONFIG.cookies.mode;
const CHROMA_COOKIE = THEME_CONFIG.cookies.chroma;
const PALETTE_COOKIE = THEME_CONFIG.cookies.palette;

export function createSettings() {
	const getInitialValue = <T extends string>(
		enumObj: Record<string, T>,
		cookieValue: string | undefined,
		defaultValue: T
	): T => {
		if (typeof document !== 'undefined' && document.documentElement) {
			const classes = document.documentElement.classList;
			for (const value of Object.values(enumObj)) {
				if (classes.contains(value)) {
					return value;
				}
			}
		}
		return Object.values(enumObj).find((v) => v === cookieValue) ?? defaultValue;
	};

	const modeCookie = getCookie(MODE_COOKIE);
	const chromaCookie = getCookie(CHROMA_COOKIE);
	const paletteCookie = getCookie(PALETTE_COOKIE);

	let mode = $state(getInitialValue(Mode, modeCookie, DEFAULT_MODE));
	let chroma = $state(getInitialValue(Chroma, chromaCookie, DEFAULT_CHROMA));
	let palette = $state(getInitialValue(Palette, paletteCookie, DEFAULT_PALETTE));
	const themeClass = $derived([mode, chroma, palette].filter(Boolean).join(' '));

	const setMode = (newMode?: Mode) => {
		if (newMode) {
			mode = newMode;
		} else if (mode !== Mode.Auto) {
			mode = mode === Mode.Dark ? Mode.Light : Mode.Dark;
		}
		setCookie(MODE_COOKIE, mode);
	};
	const setChroma = (newChroma?: Chroma) => {
		if (newChroma) {
			chroma = newChroma;
		} else {
			chroma = chroma === Chroma.Neutral ? Chroma.Chromatic : Chroma.Neutral;
		}
		setCookie(CHROMA_COOKIE, chroma);
	};
	const setPalette = (newPalette: Palette) => {
		palette = newPalette;
		setCookie(PALETTE_COOKIE, palette);
	};

	return {
		get mode() {
			return mode;
		},
		get chroma() {
			return chroma;
		},
		get palette() {
			return palette;
		},
		get paletteOptions() {
			return paletteOptions;
		},
		get themeClass() {
			return themeClass;
		},
		setMode,
		setChroma,
		setPalette
	};
}

export default createSettings();
