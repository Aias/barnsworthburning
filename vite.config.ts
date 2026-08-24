import { promises as fs } from 'node:fs';
import path from 'node:path';
import adapter from '@sveltejs/adapter-bun';
import { sveltekit } from '@sveltejs/kit/vite';
import { format } from 'oxfmt';
import { defineConfig, type Plugin, type PluginOption } from 'vite';
import { generateThemeScript } from './src/lib/theme/generate.ts';
import { generateFullTheme } from './src/styles/generators.ts';

const makeThemeFile = async () => {
	const cssContent = generateFullTheme();
	let formattedContent = cssContent;
	try {
		const result = await format('palette.css', cssContent);
		if (result.errors.length === 0) {
			formattedContent = result.code;
		} else {
			console.error(result.errors);
		}
	} catch (error) {
		console.error(error);
	}

	const outputDir = './src/styles';
	await fs.mkdir(outputDir, { recursive: true });
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

	plugins.push(
		sveltekit({
			compilerOptions: { runes: true },
			adapter: adapter(),
			paths: { relative: false },
			experimental: { remoteFunctions: true }
		})
	);

	return {
		plugins,
		build: {
			// Target browsers that support light-dark() natively so lightningcss keeps
			// minifying but skips its light-dark() polyfill. Vite 8's default
			// 'baseline-widely-available' target predates light-dark() and rewrites it into
			// --lightningcss-light/--lightningcss-dark vars keyed off prefers-color-scheme,
			// which ignores the .light/.dark class toggle and breaks the color system.
			cssTarget: ['chrome123', 'edge123', 'firefox120', 'safari17.5', 'ios17.5']
		},
		ssr: {
			// Bundle all dependencies into the Vite server build so adapter-bun's
			// Bun.build pass never re-bundles packages from node_modules. Left
			// external, Bun's tree-shaking drops zod v4's side-effect-free check
			// factories while their lazy-bound methods still reference them,
			// throwing errors like "_regex is not defined" at runtime — via any
			// import path into zod (app code, @aias/hozo, drizzle-orm/zod).
			noExternal: true
		}
	};
});
