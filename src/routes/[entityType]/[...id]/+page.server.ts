import { createApi } from '$lib/api';
import { error } from '@sveltejs/kit';
import { recordIdRegex } from '$helpers/params';
import { Table } from '$types/Airtable';
import { airtableFind } from '$lib/server/requests';
import { redirect } from '@sveltejs/kit';

export async function load({ params, fetch }) {
	const api = createApi(fetch);
	const { id, entityType } = params;

	let creatorPromise;
	let spacePromise;
	let extractPromise;
	let extractsPromise;

	if (!['creators', 'spaces', 'extracts'].includes(entityType)) {
		error(500, 'Invalid entity type.');
	}

	if (!recordIdRegex.test(id)) {
		const idSegments = id.split('/');
		let searchTable;
		if (idSegments.length > 1) {
			const extractId = idSegments[1];
			searchTable = Table.Extracts;
			const extractRecord = await airtableFind(searchTable, extractId);
			if (!extractRecord) {
				error(404, 'Not found.');
			}
			const redirectId = extractRecord.id;
			redirect(301, `/extracts/${redirectId}`);
		} else {
			searchTable =
				entityType === 'creators'
					? Table.Creators
					: entityType === 'spaces'
						? Table.Spaces
						: Table.Extracts;
			const fallbackRecord = await airtableFind(searchTable, id);
			if (!fallbackRecord) {
				error(404, 'Not found.');
			}
			const redirectId = fallbackRecord.id;
			redirect(301, `/${entityType}/${redirectId}`);
		}
	}

	switch (entityType) {
		case 'creators':
			creatorPromise = api.creators.get(id);
			extractsPromise = api.creators.extracts(id);
			break;

		case 'spaces':
			spacePromise = api.spaces.get(id);
			extractsPromise = api.spaces.extracts(id);
			break;

		case 'extracts':
			extractPromise = api.extracts.get(id);
			extractsPromise = api.extracts.related(id);
			break;
	}

	const [creator, space, extract, extracts] = await Promise.all([
		creatorPromise,
		spacePromise,
		extractPromise,
		extractsPromise
	]);

	return {
		creator,
		space,
		extract,
		extracts
	};
}
