import { writable } from 'svelte/store';

let groups = writable({
	'0': {
		loaded: false,
		data: undefined
	}
});

export default groups;
