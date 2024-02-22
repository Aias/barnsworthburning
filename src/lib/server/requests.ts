import Airtable from 'airtable';
import { error } from '@sveltejs/kit';
import type { Record, FieldSet, SelectOptions, Error } from 'airtable';
import type { IBaseRecord } from '$types/Airtable';

// const BASE_ID = 'appHWZbECVKCSjquH';
const BASE_ID = 'appNAUPSEyCYlPtvG';

Airtable.configure({
	endpointUrl: 'https://api.airtable.com',
	apiKey: import.meta.env.VITE_AIRTABLE_ACCESS_TOKEN
});

export const base = Airtable.base(BASE_ID);

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
 * Fetches records from Airtable for a given table name and options.
 * @param tableName - The name of the table to fetch records from.
 * @param options - The options to apply when fetching records.
 * @returns A promise that resolves to an array of fetched records.
 */
async function airtableFetch<T extends IBaseRecord>(
	tableName: string,
	options: SelectOptions<FieldSet>
): Promise<T[]> {
	return base(tableName)
		.select(options)
		.all()
		.then((records) => records.map(mapReceivedRecord<T>))
		.catch((err: Error) => {
			error(err.statusCode, {
				message: err.message
			});
		});
}

/**
 * Finds a record in Airtable.
 *
 * @param tableName - The name of the table to search in. Defaults to 'extracts'.
 * @param recordId - The ID of the record to find.
 * @returns A promise that resolves to the found record.
 */
async function airtableFind<T extends IBaseRecord>(
	tableName: string = 'extracts',
	recordId: Record<FieldSet>['id']
): Promise<T> {
	return base(tableName)
		.find(recordId)
		.then((record) => mapReceivedRecord<T>(record))
		.catch((err: Error) => {
			error(err.statusCode, {
				message: err.message
			});
		});
}

export { airtableFetch, airtableFind };
