import { error } from '@sveltejs/kit';
import { sectionByPath } from '$lib/records';
import { listRecordCards, listRecordGroups, PAGE_SIZE } from '$lib/server/records';
import { getCacheHeaders } from '$helpers/cache';

export async function load({ params, url, setHeaders }) {
	const section = sectionByPath(params.section);
	if (!section) error(404, 'Not found.');

	const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
	setHeaders(getCacheHeaders('entityList'));

	if (section.type === 'artifact') {
		const { cards, total } = await listRecordCards(section.type, page);
		return {
			section,
			page,
			totalPages: Math.ceil(total / PAGE_SIZE),
			cards,
			groups: undefined
		};
	}

	const { groups, total } = await listRecordGroups(section.type, page);
	return {
		section,
		page,
		totalPages: Math.ceil(total / PAGE_SIZE),
		cards: undefined,
		groups
	};
}
