import { writable } from 'svelte/store';

let extracts = writable({
	'0': {
		loaded: false,
		data: undefined
	}
});

export default extracts;
