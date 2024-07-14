//import adapterNode from '@sveltejs/adapter-node';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			$components: 'src/components',
			$helpers: 'src/helpers',
			$styles: 'src/styles',
			$types: 'src/types'
		}
	},
	compilerOptions: {
		runes: true
	}
};

export default config;
