import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin, type PluginOption } from 'vite';
import { promises as fs, existsSync } from 'fs';
import path from 'path';
import prettier from 'prettier';
import { generateFullTheme } from './src/styles/generators';
import { generateThemeScript } from './src/lib/theme/generate';

const makeThemeFile = async () => {
	const cssContent = generateFullTheme();
	let formattedContent;
	try {
		formattedContent = await prettier.format(cssContent, {
			parser: 'css'
		});
	} catch (e) {
		console.error(e);
		formattedContent = cssContent;
	}

	const outputDir = './src/styles'; // Ensure this directory exists or use your path
	if (!existsSync(outputDir)) {
		await fs.mkdir(outputDir);
	}

	await fs.writeFile(path.resolve(outputDir, 'palette.css'), formattedContent);
};

const colorGeneratorPlugin = (): Plugin => {
	return {
		name: 'vite-plugin-color-generator',
		buildStart: async () => {
			await makeThemeFile();
		}
	};
};

const themeScriptPlugin = (): Plugin => {
	return {
		name: 'vite-plugin-theme-script',
		buildStart: async () => {
			await generateThemeScript();
			console.log('✓ Generated themePreferences.js');
		}
	};
};

export default defineConfig(({ mode }) => {
	const plugins: PluginOption[] = [];
	if (mode === 'development') {
		plugins.push(colorGeneratorPlugin());
		plugins.push(themeScriptPlugin());
	} else if (mode === 'production') {
		plugins.push(themeScriptPlugin());
	}
	plugins.push(sveltekit());

	return {
		plugins
	};
});
