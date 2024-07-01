import { airtableFetch, airtableFind } from '$lib/server/requests';
import { mapCreatorRecord, mapExtractRecord } from '$helpers/mapping';
import { ExtractView, Table, type IBaseCreator, type IBaseExtract } from '$types/Airtable';
import { error } from '@sveltejs/kit';

const findAllCreators = async (creatorIds: string[]) => {
	const creatorRecords = creatorIds.map(async (creatorId) =>
		airtableFind<IBaseCreator>(Table.Creators, creatorId)
	);

	return Promise.all(creatorRecords).catch((err) => {
		error(500, err);
	});
};

const findExtractsByCreators = async (creatorIds: string[], operand: 'AND' | 'OR' = 'AND') => {
	const filterFormula = `${operand}(${creatorIds.map((id) => `FIND('${id}', creatorsLookup) > 0`).join(',')})`;
	const extracts = await airtableFetch<IBaseExtract>(Table.Extracts, {
		view: ExtractView.Best,
		filterByFormula: filterFormula,
		maxRecords: 100
	});

	return extracts;
};

export async function load({ params }) {
	const creatorIds = params.creatorIds?.split('/');

	const [creators, extracts] = await Promise.all([
		findAllCreators(creatorIds),
		findExtractsByCreators(creatorIds)
	]).catch((err) => {
		error(500, err);
	});

	return {
		selectedCreatorsData: creators.map(mapCreatorRecord),
		extractsByCreators: extracts.map(mapExtractRecord)
	};
}
