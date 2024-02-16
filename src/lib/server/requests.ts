import Airtable from 'airtable';
import { error } from '@sveltejs/kit';
import type { Record, FieldSet, SelectOptions } from 'airtable';

// const BASE_ID = 'appHWZbECVKCSjquH';
const BASE_ID = 'appNAUPSEyCYlPtvG';

Airtable.configure({
	endpointUrl: 'https://api.airtable.com',
	apiKey: import.meta.env.VITE_AIRTABLE_ACCESS_TOKEN
});

const base = Airtable.base(BASE_ID);

const mapReceivedRecord = (record: Record<FieldSet>) => {
	return {
		id: record.id,
		...record.fields
	};
};

const airtableFetch = async (tableName: string, options: SelectOptions<FieldSet>) =>
	base(tableName)
		.select(options)
		.all()
		.then((records) => records.map(mapReceivedRecord))
		.catch((err) => {
			error(500, {
				message: err
			});
			return null;
		});

const airtableFind = async (tableName: string = 'extracts', recordId: Record<FieldSet>['id']) =>
	base(tableName)
		.find(recordId)
		.then((record) => mapReceivedRecord(record))
		.catch((err) => {
			error(500, {
				message: err
			});
			return null;
		});

export { airtableFetch, airtableFind };
