import Airtable from 'airtable';

Airtable.configure({
	endpointUrl: 'https://api.airtable.com',
	apiKey: 'key8N24RInkvmsEgD'
});
let base = Airtable.base('appRtVtmOW4oibIij');

export default base;
