import { writable, derived } from 'svelte/store';
import get from 'lodash/get';
import findIndex from 'lodash/findIndex';

export const extracts = writable({
	byKey: {},
	allKeys: []
});

export const extractPages = writable([]);

export const extractWall = derived(extractPages, ($extractPages) => {
	const nested = nestByWork(trimDuplicates($extractPages));
	const orderedGroups = Object.keys(nested)
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

	return orderedGroups;
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
				const firstGroupOfNextPage = pages[i + 1][0] || {};
				const groupLastUpdated = get(firstGroupOfNextPage, 'group_last_updated_flat', '');
				const groupSlug = get(firstGroupOfNextPage, 'group_slug', [])[0];

				const currentPageGroupIndex = findIndex(page, (extract) => {
					return (
						extract['group_last_updated_flat'] === groupLastUpdated &&
						get(extract, 'group_slug', [])[0] === groupSlug
					);
				});

				if (currentPageGroupIndex >= 0) {
					return page.slice(0, currentPageGroupIndex);
				} else {
					return page;
				}
			})
			.flat();
	}
};

const nestByWork = (extracts = []) => {
	return extracts.reduce((groups, extract) => {
		const groupName = get(extract, 'group_name[0]', 'Ungrouped');
		const groupSlug = get(extract, 'group_slug[0]', '-1');
		const lastUpdated = new Date(extract['group_last_updated_flat']);

		if (typeof groups[groupSlug] !== 'object') {
			groups[groupSlug] = {
				slug: groupSlug,
				name: groupName,
				extracts: [],
				updated: lastUpdated
			};
		}

		groups[groupSlug].extracts.push(extract);

		return groups;
	}, {});
};
