import { writable } from 'svelte/store';

export const defaultSpaces = [
	'understanding',
	'architecture',
	'information',
	'melancholy',
	'creativity',
	'aesthetics',
	'perception',
	'urbanism',
	'teaching',
	'problems',
	'identity',
	'function',
	'material',
	'meaning',
	'writing',
	'details',
	'seeing',
	'beauty',
	'nature',
	'design',
	'making',
	'memory',
	'cities',
	'color',
	'craft',
	'death',
	'words',
	'work',
	'life',
	'time',
	'art',
	'zen',
	'ux',
	'i'
].map((space) => ({
	topic: space,
	field_length: space.length,
	num_extracts: undefined,
	title: undefined,
	description: undefined
}));

let spaces = writable(defaultSpaces);

export default spaces;
