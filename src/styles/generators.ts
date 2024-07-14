import radix from '@radix-ui/colors';
import { Palette, Shade, paletteOptions, neutralsMap, type Neutral } from '../types/Theme';

interface Ramp {
	[key: string]: string;
}

const darkSuffix = 'Dark';
const p3Suffix = 'P3';
const alphaSuffix = 'A';
const numSteps = 12;
const rampLevels = Array.from({ length: numSteps }, (_, i) => i + 1);

const generateShadeRamp = (shade: Shade, isP3: Boolean) => {
	const p3 = isP3 ? p3Suffix : '';
	const alphaRamp: Ramp = radix[`${shade}${p3}${alphaSuffix}`];

	let scss = '';
	for (const level of rampLevels) {
		const key = `${shade}${alphaSuffix}${level}`;
		scss += `--${shade}-a${level}: ${alphaRamp[key]};\n`;
	}
	return scss;
};

const generateShadeClasses = (isP3: Boolean = false) => {
	let scss = ':root {\n';
	scss += generateShadeRamp(Shade.Black, isP3);
	scss += '\n';
	scss += generateShadeRamp(Shade.White, isP3);
	scss += '}\n\n';
	return scss;
};

const generateVariableRamp = (palette: Palette, isP3: Boolean, isNeutral: Boolean) => {
	const p3 = isP3 ? p3Suffix : '';
	const type = isNeutral ? 'neu' : 'clr';
	const lightRamp: Ramp = radix[`${palette}${p3}`];
	const darkRamp: Ramp = radix[`${palette}${darkSuffix}${p3}`];
	const lightAlphaRamp: Ramp = radix[`${palette}${p3}${alphaSuffix}`];
	const darkAlphaRamp: Ramp = radix[`${palette}${darkSuffix}${p3}${alphaSuffix}`];

	let scss = '';
	for (const level of rampLevels) {
		const key = `${palette}${level}`;

		const lightColor = lightRamp[key];
		const darkColor = darkRamp[key];

		scss += `--${type}-${level}: light-dark(${lightColor}, ${darkColor});\n`;
	}
	scss += '\n';
	for (const level of rampLevels) {
		const key = `${palette}${alphaSuffix}${level}`;

		const lightColor = lightAlphaRamp[key];
		const darkColor = darkAlphaRamp[key];

		scss += `--${type}-a${level}: light-dark(${lightColor}, ${darkColor});\n`;
	}

	return scss;
};

const generateColorClasses = (isP3: Boolean = false) => {
	let scss = '';
	for (const palette of paletteOptions) {
		scss += `.${palette} {\n`;
		scss += generateVariableRamp(palette, isP3, false);
		scss += `}\n\n`;
	}

	return scss;
};

const generateNeutralClasses = (isP3: Boolean = false) => {
	let scss = '';
	for (const neutral in neutralsMap) {
		const palettes = neutralsMap[neutral as Neutral];
		scss += `${palettes.map((palette) => `.${palette}`).join(', ')} {`;
		scss += generateVariableRamp(palettes[0], isP3, true);
		scss += '}\n\n';
	}
	return scss;
};

export const generateFullTheme = () => {
	let scss = '';

	scss += generateShadeClasses(false);
	scss += generateColorClasses(false);
	scss += generateNeutralClasses(false);

	scss += '@supports (color: color(display-p3 1 1 1)) {\n';
	scss += '@media (color-gamut: p3) {\n';
	scss += generateShadeClasses(true);
	scss += generateColorClasses(true);
	scss += generateNeutralClasses(true);
	scss += '}\n';
	scss += '}\n';

	return scss;
};
