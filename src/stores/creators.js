import { writable } from 'svelte/store';

let creators = writable({
	'0': {
		loaded: false,
		data: undefined
	}
});

export default creators;
