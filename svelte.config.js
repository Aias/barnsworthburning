import adapter from '@sveltejs/adapter-node';

// https://kit.svelte.dev/docs#configuration
const config = {
	// options passed to svelte.compile (https://svelte.dev/docs#svelte_compile)
	compilerOptions: null,

	// an array of file extensions that should be treated as Svelte components
	extensions: ['.svelte'],

	kit: {
		adapter: adapter(),
		amp: false,
		files: {
			assets: 'static',
			hooks: 'src/hooks',
			lib: 'src/lib',
			routes: 'src/routes',
			template: 'src/app.html'
		},
		floc: false,
		hydrate: true,
		prerender: {
			crawl: true,
			enabled: true,
			onError: 'fail',
			entries: ['*']
		},
		router: true
	}
};

export default config;
