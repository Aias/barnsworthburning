import Airtable from 'airtable';
import env from 'dotenv';

env.config();

Airtable.configure({
	endpointUrl: process.env.AIRTABLE_API_URL,
	apiKey: process.env.AIRTABLE_API_KEY
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
	const records = await airtableFetch(tableName, {
		filterByFormula: `RECORD_ID() = '${recordId}'`
	});
	if (records && records.length) {
		return records[0];
	} else {
		return null;
	}
};

export { airtableFetch, airtableFind };
