import { createApi } from '$lib/api';
import { error } from '@sveltejs/kit';
import { recordIdRegex } from '$helpers/params.js';
import { Table } from '$types/Airtable.js';
import { airtableFind } from '$lib/server/requests.js';
import { redirect } from '@sveltejs/kit';

export async function load({ params, fetch }) {
	const api = createApi(fetch);
	const { id, entityType } = params;

	let creatorPromise;
	let spacePromise;
	let extractsPromise;

	if (!['creators', 'spaces', 'extracts'].includes(entityType)) {
		error(500, 'Invalid entity type.');
	}

	if (!recordIdRegex.test(id)) {
		let idSegments = id.split('/');
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
			extractsPromise = api.extracts.related(id);
			break;

		default:
			error(500, 'Invalid entity type');
	}

	const [creator, space, extracts] = await Promise.all([
		creatorPromise,
		spacePromise,
		extractsPromise
	]);

	return {
		creator,
		space,
		extracts
	};
}
