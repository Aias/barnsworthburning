import { writable } from 'svelte/store';

let title = 'barnsworthburning';
let description = 'A commonplace book.';
let author = 'Nick Trombley';
let keywords =
	'Nick Trombley, design, barnsworthburning, barns worth burning, commonplace, reading, writing, art, books';
let themeColor = '#B7391D';

let seoObj = {
	title,
	description,
	author,
	keywords,
	themeColor,
};

const seo = writable(seoObj);

const updateSeo = (vals = {}) => {
	return seo.update((n) => ({
		...seoObj,
		...vals,
	}));
};

export default seo;
export { updateSeo };
