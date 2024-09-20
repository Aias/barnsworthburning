import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin, type PluginOption } from 'vite';
import { promises as fs, existsSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import prettier from 'prettier';
import { generateFullTheme } from './src/styles/generators';

const makeThemeFile = async () => {
	const cssContent = generateFullTheme();
	let formattedContent = '';
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

// Load environment variables from .env files
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

export default defineConfig(({ mode }) => {
	const plugins: PluginOption[] = [];
	// Load development or production .env file based on Vite mode
	if (mode === 'development') {
		dotenv.config({ path: '.env.development' });
		plugins.push(colorGeneratorPlugin());
	} else if (mode === 'production') {
		dotenv.config({ path: '.env.production' });
	}
	plugins.push(sveltekit());

	return {
		plugins
	};
});
