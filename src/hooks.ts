import type { Reroute } from '@sveltejs/kit';

export const reroute: Reroute = ({ url }) => {
	if (url.pathname.endsWith('.md')) {
		return url.pathname.replace(/\.md$/, '.txt');
	}
};
