import { writable } from 'svelte/store';

export const patterns = writable({
	patterns: {},
	groups: {},
	categories: {}
});
