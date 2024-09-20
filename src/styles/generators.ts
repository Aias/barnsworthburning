import radix from '@radix-ui/colors';
import {
	Palette,
	Shade,
	paletteOptions,
	neutralsMap,
	type Neutral,
	DEFAULT_PALETTE
} from '../types/Theme';

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

	let css = '';
	for (const level of rampLevels) {
		const key = `${shade}${alphaSuffix}${level}`;
		css += `--${shade}-a${level}: ${alphaRamp[key]};\n`;
	}
	return css;
};

const generateShadeClasses = (isP3: Boolean = false) => {
	let css = ':root {\n';
	css += generateShadeRamp(Shade.Black, isP3);
	css += '\n';
	css += generateShadeRamp(Shade.White, isP3);
	css += '}\n\n';
	return css;
};

const generateVariableRamp = (palette: Palette, isP3: Boolean, isNeutral: Boolean) => {
	const p3 = isP3 ? p3Suffix : '';
	const type = isNeutral ? 'neu' : 'clr';
	const lightRamp: Ramp = radix[`${palette}${p3}`];
	const darkRamp: Ramp = radix[`${palette}${darkSuffix}${p3}`];
	const lightAlphaRamp: Ramp = radix[`${palette}${p3}${alphaSuffix}`];
	const darkAlphaRamp: Ramp = radix[`${palette}${darkSuffix}${p3}${alphaSuffix}`];

	let css = '';
	for (const level of rampLevels) {
		const key = `${palette}${level}`;

		const lightColor = lightRamp[key];
		const darkColor = darkRamp[key];

		css += `--${type}-${level}: light-dark(${lightColor}, ${darkColor});\n`;
	}
	css += '\n';
	for (const level of rampLevels) {
		const key = `${palette}${alphaSuffix}${level}`;

		const lightColor = lightAlphaRamp[key];
		const darkColor = darkAlphaRamp[key];

		css += `--${type}-a${level}: light-dark(${lightColor}, ${darkColor});\n`;
	}

	return css;
};

const NO_CLASS = ':root:where(:not([class]), [class=""])';

const generateColorClasses = (isP3: Boolean = false) => {
	let css = '';
	for (const palette of paletteOptions) {
		const selectors = [`.${palette}`];
		if (palette === DEFAULT_PALETTE) {
			selectors.push(NO_CLASS);
		}
		css += `${selectors.join(', ')} {\n`;
		css += generateVariableRamp(palette, isP3, false);
		css += `}\n\n`;
	}

	return css;
};

const generateNeutralClasses = (isP3: Boolean = false) => {
	let css = '';
	for (const neutral in neutralsMap) {
		const palettes = neutralsMap[neutral as Neutral];
		const selectors = palettes.map((palette) => `.${palette}`);
		if (palettes.includes(DEFAULT_PALETTE)) {
			selectors.push(NO_CLASS);
		}
		css += `${selectors.join(', ')} {`;
		css += generateVariableRamp(palettes[0], isP3, true);
		css += '}\n\n';
	}
	return css;
};

export const generateFullTheme = () => {
	let css = '';

	css += generateShadeClasses(false);
	css += generateColorClasses(false);
	css += generateNeutralClasses(false);

	css += '@supports (color: color(display-p3 1 1 1)) {\n';
	css += '@media (color-gamut: p3) {\n';
	css += generateShadeClasses(true);
	css += generateColorClasses(true);
	css += generateNeutralClasses(true);
	css += '}\n';
	css += '}\n';

	return css;
};
