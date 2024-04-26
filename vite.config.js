import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

// Load environment variables from .env files
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

export default defineConfig(({ mode }) => {
	// Load development or production .env file based on Vite mode
	if (mode === 'development') {
		dotenv.config({ path: '.env.development' });
	} else if (mode === 'production') {
		dotenv.config({ path: '.env.production' });
	}

	return {
		plugins: [sveltekit()]
	};
});
