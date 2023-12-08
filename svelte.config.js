import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			$components: 'src/components',
			$helpers: 'src/helpers',
			$styles: 'src/styles',
			$schema: 'src/schema'
		}
	},
	preprocess: preprocess()
	// compilerOptions: {
	// 	runes: true
	// }
};

export default config;
