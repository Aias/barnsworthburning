import { setCookie, getCookie } from '$helpers/cookies';
import {
	Palette,
	Mode,
	Chroma,
	paletteOptions,
	DEFAULT_MODE,
	DEFAULT_CHROMA,
	DEFAULT_PALETTE
} from '$types/Theme';
import { MODE_COOKIE, CHROMA_COOKIE, PALETTE_COOKIE } from './themePreferences';

export function createSettings() {
	const modeCookie = getCookie(MODE_COOKIE) as Mode | null;
	const chromaCookie = getCookie(CHROMA_COOKIE) as Chroma | null;
	const paletteCookie = getCookie(PALETTE_COOKIE) as Palette | null;

	let mode: Mode = $state(modeCookie ?? DEFAULT_MODE);
	let chroma: Chroma = $state(chromaCookie ?? DEFAULT_CHROMA);
	let palette: Palette = $state(paletteCookie ?? DEFAULT_PALETTE);
	const themeClass = $derived(`${mode} ${chroma} ${palette}`);

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
