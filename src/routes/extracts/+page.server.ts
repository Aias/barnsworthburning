import { error } from '@sveltejs/kit';
import { airtableFetch } from '$lib/server/requests';
import { mapExtractRecord } from '$helpers/mapping';
import { ExtractView, Table, type IBaseExtract } from '$types/Airtable';

const MAX_RECORDS = 100;

export async function load() {
	const extracts = await airtableFetch<IBaseExtract>(Table.Extracts, {
		view: ExtractView.Works,
		maxRecords: MAX_RECORDS
	});

	if (!extracts) {
		error(404, {
			message: 'Failed to load extracts.'
		});
	}

	return {
		recentExtracts: extracts.map(mapExtractRecord)
	};
}
