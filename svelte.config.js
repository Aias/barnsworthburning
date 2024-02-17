//import adapterNode from '@sveltejs/adapter-node';
import adapterNetlify from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapterNetlify(),
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
