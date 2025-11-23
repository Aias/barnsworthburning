import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		experimental: {
			remoteFunctions: true
		},
		adapter: adapter(),
		alias: {
			$components: 'src/components',
			$helpers: 'src/helpers',
			$styles: 'src/styles',
			$types: 'src/types'
		}
	},
	compilerOptions: {
		experimental: {
			async: true
		},
		runes: true
	}
};

export default config;
