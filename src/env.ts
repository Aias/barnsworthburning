import { defineEnvVars } from '@sveltejs/kit/env';
import { z } from 'zod';

export const variables = defineEnvVars({
	DATABASE_URL: {
		description: 'Postgres connection for the Red Cliff Record database.',
		schema: z.url()
	},
	PUBLIC_RCR_URL: {
		description:
			'Base URL of the Red Cliff Record app; enables the "Open in Red Cliff Record" button on record cards.',
		public: true,
		schema: z.url().optional()
	}
});
