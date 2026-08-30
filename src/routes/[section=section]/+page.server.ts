import { getCacheHeaders } from '#helpers/cache.js';
import { sectionByPath } from '#lib/records.js';
import { listRecordCards, listRecordGroups } from '#lib/server/records.js';
import { error } from '@sveltejs/kit';

export async function load({ params, setHeaders }) {
	const section = sectionByPath(params.section);
	if (!section) error(404, 'Not found.');

	setHeaders(getCacheHeaders('entityList'));

	if (section.type === 'artifact') {
		return { section, cards: await listRecordCards(section.type), groups: undefined };
	}
	return { section, cards: undefined, groups: await listRecordGroups(section.type) };
}
