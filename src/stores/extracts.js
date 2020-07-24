import { writable, derived } from 'svelte/store';
import get from '../helpers/get';

export const extracts = writable({
	byKey: {},
	allKeys: []
});

export const extractPages = writable([]);

export const extractWall = derived(extractPages, ($extractPages) => {
	const nested = nestByWork(trimDuplicates($extractPages));
	const orderedWorks = Object.keys(nested)
		.map((key) => nested[key])
		.sort((a, b) => {
			if (a.updated > b.updated) {
				return -1;
			} else if (a.updated < b.updated) {
				return 1;
			} else {
				return 0;
			}
		});

	return orderedWorks;
});

const trimDuplicates = (pages = []) => {
	if (pages.length === 0) {
		return pages[0];
	} else {
		return pages
			.map((page, i) => {
				if (i === pages.length - 1) {
					return page;
				}
				const firstWorkOfNextPage = pages[i + 1][0] || {};
				const workLastUpdated = get(firstWorkOfNextPage, 'work_last_updated_flat', '');
				const workSlug = get(firstWorkOfNextPage, 'work_slug', [])[0];

				const currentPageWorkIndex = page.findIndex((extract) => {
					return (
						extract['work_last_updated_flat'] === workLastUpdated &&
						get(extract, 'work_slug', [])[0] === workSlug
					);
				});

				if (currentPageWorkIndex >= 0) {
					return page.slice(0, currentPageWorkIndex);
				} else {
					return page;
				}
			})
			.flat();
	}
};

const nestByWork = (extracts = []) => {
	return extracts.reduce((works, extract) => {
		const workName = get(extract, 'work_name[0]', 'Unknown');
		const workSlug = get(extract, 'work_slug[0]', '-1');
		const lastUpdated = new Date(extract['work_last_updated_flat']);

		if (typeof works[workSlug] !== 'object') {
			works[workSlug] = {
				slug: workSlug,
				name: workName,
				extracts: [],
				updated: lastUpdated
			};
		}

		works[workSlug].extracts.push(extract);

		return works;
	}, {});
};
