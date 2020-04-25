import { writable } from 'svelte/store';

let selectedSpace = writable('everything');

export { selectedSpace };
