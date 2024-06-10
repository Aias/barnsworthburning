import { airtableFetch, airtableFind } from '$lib/server/requests';
import { mapSpaceRecord, mapExtractRecord } from '$helpers/mapping';
import { ExtractView, Table, type IBaseSpace, type IBaseExtract } from '$types/Airtable';

const findAllSpaces = async (spaceIds: string[]) => {
	const spaceRecords = spaceIds.map(async (spaceId) =>
		airtableFind<IBaseSpace>(Table.Spaces, spaceId)
	);

	return Promise.all(spaceRecords);
};

const findExtractsByCreators = async (spaceIds: string[], operand: 'AND' | 'OR' = 'AND') => {
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

	const spaces = await findAllSpaces(spaceIds);
	const extracts = await findExtractsByCreators(spaceIds);

	return {
		selectedSpacesData: spaces.map(mapSpaceRecord),
		extractsInSpaces: extracts.map(mapExtractRecord)
	};
}
