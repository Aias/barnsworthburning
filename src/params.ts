import { defineParams } from '@sveltejs/kit/params';
import { z } from 'zod';

export const params = defineParams({
	id: z
		.string()
		.regex(/^[1-9]\d*$/)
		.transform(Number),
	section: z.enum(['artifacts', 'entities', 'concepts'])
});
