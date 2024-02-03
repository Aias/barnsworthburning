import { error } from '@sveltejs/kit';
import { airtableFetch } from '$lib/server/requests';
import zip from '$helpers/zip';

const MAX_RECORDS = 100;

export async function load() {
	const records = await airtableFetch('extracts', {
		view: 'viwTkCBV6uRoHplvP', // Works
		sort: [{ field: 'lastUpdated', direction: 'desc' }],
		maxRecords: MAX_RECORDS
	});

	if (!records) {
		error(404, {
			message: 'Failed to load extract.'
		});
		return null;
	}

	return {
		index: records.map((record) => ({
			...record,
			creators: zip(['id', 'name'], record.creators, record.creatorNames),
			spaces: zip(['id', 'name'], record.spaces, record.spaceTopics),
			parent: zip(['id', 'name'], record.parent, record.parentTitle),
			parentCreators: zip(['id', 'name'], record.parentCreatorIds, record.parentCreatorNames),
			children: zip(['id', 'name'], record.children, record.childTitles),
			connections: zip(['id', 'name'], record.connections, record.connectionTitles),
			extractedOn: new Date(record.extractedOn),
			lastUpdated: new Date(record.lastUpdated)
		}))
	};
}
