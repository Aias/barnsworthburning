import { error, json } from '@sveltejs/kit';
import { airtableFetch } from '$lib/server/requests';
import type { RequestHandler } from '@sveltejs/kit';
import { type IBaseCreator, AirtableTables } from '$types/Airtable';

export const GET: RequestHandler = async ({ url }) => {
	const maxRecords = Number(url.searchParams.get('max') ?? '100');

	const records = await airtableFetch<IBaseCreator>(AirtableTables.Creators, {
		maxRecords
	});

	if (!records) {
		error(404, {
			message: 'Failed to load creators.'
		});
	}

	return json(records);
};
