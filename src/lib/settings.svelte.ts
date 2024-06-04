import { setCookie } from '$helpers/cookies';
import { Palette, Mode, Chroma, paletteOptions } from '$types/Theme';
import {
	MODE_COOKIE,
	DEFAULT_MODE,
	CHROMA_COOKIE,
	DEFAULT_CHROMA,
	PALETTE_COOKIE,
	DEFAULT_PALETTE
} from './themePreferences';

export function createSettings() {
	let mode: Mode = $state(DEFAULT_MODE);
	let chroma: Chroma = $state(DEFAULT_CHROMA);
	let palette: Palette = $state(DEFAULT_PALETTE);
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
