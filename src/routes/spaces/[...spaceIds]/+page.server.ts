import { airtableFetch, airtableFind } from '$lib/server/requests';
import { mapSpaceRecord, mapExtractRecord } from '$helpers/mapping';
import { ExtractView, Table, type IBaseSpace, type IBaseExtract } from '$types/Airtable';
import { error } from '@sveltejs/kit';

const findAllSpaces = async (spaceIds: string[]) => {
	const spaceRecords = spaceIds.map(async (spaceId) =>
		airtableFind<IBaseSpace>(Table.Spaces, spaceId)
	);

	return Promise.all(spaceRecords).catch((err) => {
		error(500, err);
	});
};

const findExtractsInSpaces = async (spaceIds: string[], operand: 'AND' | 'OR' = 'AND') => {
	const filterFormula = `${operand}(${spaceIds.map((id) => `FIND('${id}', spacesLookup) > 0`).join(',')})`;
	const extracts = await airtableFetch<IBaseExtract>(Table.Extracts, {
		view: ExtractView.Best,
		filterByFormula: filterFormula,
		maxRecords: 100
	});

	return extracts;
};

export async function load({ params }) {
	const spaceIds = params.spaceIds?.split('/');

	const [spaces, extracts] = await Promise.all([
		findAllSpaces(spaceIds),
		findExtractsInSpaces(spaceIds)
	]).catch((err) => {
		error(500, err);
	});

	return {
		selectedSpacesData: spaces.map(mapSpaceRecord),
		extractsInSpaces: extracts.map(mapExtractRecord)
	};
}
