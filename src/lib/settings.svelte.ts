import { setCookie } from '$helpers/cookies';
import { Palette, Mode, Chroma, paletteOptions } from '$types/Theme';

export function createSettings() {
	let mode: Mode = $state(Mode.Auto);
	let chroma: Chroma = $state(Chroma.Neutral);
	let palette: Palette = $state(Palette.Gold);
	const themeClass = $derived(`${mode} ${chroma} ${palette}`);

	const setMode = (newMode?: Mode) => {
		if (newMode) {
			mode = newMode;
		} else if (mode !== Mode.Auto) {
			mode = mode === Mode.Dark ? Mode.Light : Mode.Dark;
		}
		setCookie('barnsworthburning-mode', mode);
	};
	const setChroma = (newChroma?: Chroma) => {
		if (newChroma) {
			chroma = newChroma;
		} else {
			chroma = chroma === Chroma.Neutral ? Chroma.Chromatic : Chroma.Neutral;
		}
		setCookie('barnsworthburning-chroma', chroma);
	};
	const setPalette = (newPalette: Palette) => {
		palette = newPalette;
		setCookie('barnsworthburning-palette', palette);
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
