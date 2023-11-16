import Airtable from 'airtable';

Airtable.configure({
	endpointUrl: 'https://api.airtable.com',
	apiKey: import.meta.env.VITE_AIRTABLE_API_KEY
});

const base = Airtable.base('appHWZbECVKCSjquH');

const mapReceivedRecord = (record) => ({
	id: record.id,
	...record.fields
});

const airtableFetch = async (tableName = '', options = {}) =>
	base(tableName)
		.select(options)
		.all()
		.then((records) => records.map(mapReceivedRecord))
		.catch((error) => {
			console.error(error);
			return null;
		});

const airtableFind = async (tableName = '', recordId = '') => {
	const record = await base
		.find(recordId)
		.then((record) => mapReceivedRecord(record))
		.catch((error) => {
			console.error(error);
			return null;
		});
};

export { airtableFetch, airtableFind };
