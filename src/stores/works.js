import { writable } from 'svelte/store';

let works = writable({
	'0': {
		loaded: false,
		data: undefined
	}
});

export default works;
