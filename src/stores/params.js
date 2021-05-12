import { writable } from 'svelte/store';

const fragmentSlug = writable();

const updateFragmentSlug = (slug) => {
	return fragmentSlug.update(() => slug);
};

export default fragmentSlug;
export { updateFragmentSlug };
