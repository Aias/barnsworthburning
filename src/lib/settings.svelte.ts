import { setCookie } from '$helpers/cookies';
import { Palette, Mode, Chroma } from '$types/Theme';

const paletteOptions: Palette[] = [
	Palette.Indigo,
	Palette.Sky,
	Palette.Grass,
	Palette.Amber,
	Palette.Tomato
];

export function createSettings() {
	let mode: Mode = $state(Mode.Dark);
	let chroma: Chroma = $state(Chroma.Neutral);
	let palette: Palette | undefined = $state();
	const themeClass = $derived(`${mode} ${chroma} ${palette}`);

	const toggleMode = (newMode?: Mode) => {
		if (newMode) {
			mode = newMode;
		} else {
			mode = mode === Mode.Dark ? Mode.Light : Mode.Dark;
		}
		setCookie('barnsworthburning-mode', mode);
	};
	const toggleChroma = (newChroma?: Chroma) => {
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
		toggleMode,
		toggleChroma,
		setPalette
	};
}

export default createSettings();
