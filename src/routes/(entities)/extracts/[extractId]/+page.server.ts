import { error } from '@sveltejs/kit';
import { airtableFetch } from '$lib/server/requests';
import { mapExtractRecord } from '$helpers/mapping';
import { ExtractView, Table, type IBaseExtract } from '$types/Airtable';

export async function load({ params }) {
	const { extractId } = params;
	const filterFormula = `FIND('${extractId}', extractsLookup) > 0`;
	const extracts = await airtableFetch<IBaseExtract>(Table.Extracts, {
		view: ExtractView.ByEntryDate,
		filterByFormula: filterFormula
	});

	if (!extracts) {
		error(404, {
			message: 'Extract not found.'
		});
	}

	return {
		selectedExtractData: extracts.map(mapExtractRecord)
	};
}
