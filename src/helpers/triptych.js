import { writable } from 'svelte/store';
import { getContext, setContext } from 'svelte';

const defaultMode = 'dark';
const defaultPalette = 'amber';
const defaultChroma = 'neutral';

export const mode = writable(defaultMode);
export const palette = writable(defaultPalette);
export const chroma = writable(defaultChroma);

export const useTriptych = (
	triptych = {
		mode: undefined,
		palette: undefined,
		chroma: undefined
	}
) => {
	const { mode, palette, chroma } = triptych;

	const contextMode = getContext('mode');
	const contextPalette = getContext('palette');
	const contextChroma = getContext('chroma');

	const newMode = mode || contextMode;
	const newPalette = palette || contextPalette;
	const newChroma = chroma || contextChroma;

	setContext('mode', newMode);
	setContext('palette', newPalette);
	setContext('chroma', newChroma);

	return makeTriptychClass(newMode, newPalette, newChroma);
};

export const makeTriptychClass = (mode = defaultMode, palette = defaultPalette, chroma = defaultChroma) =>
	`${mode} ${palette} ${chroma}`;

export default useTriptych;
