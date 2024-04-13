//import adapterNode from '@sveltejs/adapter-node';
import adapterNetlify from '@sveltejs/adapter-netlify';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapterNetlify({
			// if true, will create a Netlify Edge Function rather
			// than using standard Node-based functions
			edge: true,

			// if true, will split your app into multiple functions
			// instead of creating a single one for the entire app.
			// if `edge` is true, this option cannot be used
			split: false
		}),
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
