import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => ['artifacts', 'entities', 'concepts'].includes(param);
