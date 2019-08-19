import { writable } from 'svelte/store';
import seed from '../helpers/spaces';

let initialSpaces = {};

Object.keys(seed).forEach(key => {
	initialSpaces[key] = {
		id: seed[key],
		loaded: false,
		data: undefined
	};
});

let spaces = writable(initialSpaces);

let selectedSpace = writable('i');

export default spaces;
export { selectedSpace };
