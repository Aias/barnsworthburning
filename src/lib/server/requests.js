import Airtable from 'airtable';
import { error } from '@sveltejs/kit';

// const BASE_ID = 'appHWZbECVKCSjquH';
const BASE_ID = 'appNAUPSEyCYlPtvG';

Airtable.configure({
	endpointUrl: 'https://api.airtable.com',
	apiKey: import.meta.env.VITE_AIRTABLE_ACCESS_TOKEN
});

const base = Airtable.base(BASE_ID);

const mapReceivedRecord = (record) => {
	return {
		id: record.id,
		...record.fields
	};
};

const airtableFetch = async (tableName = '', options = {}) =>
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

const airtableFind = async (tableName = '', recordId = '') =>
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
