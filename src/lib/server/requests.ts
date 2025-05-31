import Airtable from 'airtable';
import { error } from '@sveltejs/kit';
import type { Record, FieldSet, SelectOptions, Error } from 'airtable';
import { type IBaseRecord, AirtableBaseId, Table } from '$types/Airtable';
import { slugify, recordIdRegex } from '$helpers/params';

Airtable.configure({
	endpointUrl: 'https://api.airtable.com',
	apiKey: import.meta.env.VITE_AIRTABLE_ACCESS_TOKEN
});

export const base = Airtable.base(AirtableBaseId);

// Request deduplication
const pendingRequests = new Map<string, Promise<any>>();

/**
 * Creates a cache key for deduplication based on table and options
 */
function createCacheKey(table: Table, options: SelectOptions<FieldSet> | string): string {
	if (typeof options === 'string') {
		return `${table}:${options}`;
	}
	const sortedOptions = JSON.stringify(options, Object.keys(options).sort());
	return `${table}:${sortedOptions}`;
}

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
	const cacheKey = createCacheKey(table, options);

	// Check if request is already pending
	if (pendingRequests.has(cacheKey)) {
		return pendingRequests.get(cacheKey) as Promise<T[]>;
	}

	// Create new request and store in pending map
	const requestPromise = base(table)
		.select(options)
		.all()
		.then((records) => records.map(mapReceivedRecord<T>))
		.catch((err: Error) => {
			error(err.statusCode, {
				...err
			});
		})
		.finally(() => {
			// Clean up after request completes
			pendingRequests.delete(cacheKey);
		});

	pendingRequests.set(cacheKey, requestPromise);
	return requestPromise;
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
	if (!recordIdRegex.test(recordId)) {
		// If the record ID is not a valid Airtable record ID, assume it's a slug.
		return airtableFetch<T>(table, {
			filterByFormula: `slug = "${slugify(recordId)}"`
		}).then((records) => {
			if (records.length === 0) {
				error(404, `Record with ID "${recordId}" not found.`);
			}
			return records[0];
		});
	}

	const cacheKey = createCacheKey(table, recordId);

	// Check if request is already pending
	if (pendingRequests.has(cacheKey)) {
		return pendingRequests.get(cacheKey) as Promise<T>;
	}

	// Create new request and store in pending map
	const requestPromise = base(table)
		.find(recordId)
		.then(mapReceivedRecord<T>)
		.catch((err: Error) => {
			error(err.statusCode, {
				...err
			});
		})
		.finally(() => {
			// Clean up after request completes
			pendingRequests.delete(cacheKey);
		});

	pendingRequests.set(cacheKey, requestPromise);
	return requestPromise;
}

export { airtableFetch, airtableFind };
