import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			$components: 'src/components',
			$helpers: 'src/helpers',
			$styles: 'src/styles'
		}
	}
};

export default config;
