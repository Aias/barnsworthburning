import Airtable from 'airtable';
import { error } from '@sveltejs/kit';
import type { Record, FieldSet, SelectOptions, Error } from 'airtable';
import { type IBaseRecord, AirtableBaseId, Table } from '$types/Airtable';

Airtable.configure({
	endpointUrl: 'https://api.airtable.com',
	apiKey: import.meta.env.VITE_AIRTABLE_ACCESS_TOKEN
});

export const base = Airtable.base(AirtableBaseId);

/**
 * Maps a received record to an IBaseRecord.
 * @param record The record to be mapped.
 * @returns The mapped IBaseRecord.
 */
function mapReceivedRecord<T extends IBaseRecord>(record: Record<FieldSet>): T {
	return {
		id: record.id,
		...record.fields
	} as T;
}

/**
 * Fetches records from Airtable for a given table with options.
 * @param table - The table to fetch records from.
 * @param options - The options to apply when fetching records.
 * @returns A promise that resolves to an array of fetched records.
 */
async function airtableFetch<T extends IBaseRecord>(
	table: Table,
	options: SelectOptions<FieldSet>
): Promise<T[]> {
	return base(table)
		.select(options)
		.all()
		.then((records) => records.map(mapReceivedRecord<T>))
		.catch((err: Error) => {
			error(500, {
				...err
			});
		});
}

/**
 * Finds a record in Airtable.
 *
 * @param table - The table to search in. Defaults to Extracts.
 * @param recordId - The ID of the record to find.
 * @returns A promise that resolves to the found record.
 */
async function airtableFind<T extends IBaseRecord>(
	table: Table = Table.Extracts,
	recordId: Record<FieldSet>['id']
): Promise<T> {
	return base(table)
		.find(recordId)
		.then((record) => mapReceivedRecord<T>(record))
		.catch((err: Error) => {
			error(500, {
				...err
			});
		});
}

export { airtableFetch, airtableFind };
