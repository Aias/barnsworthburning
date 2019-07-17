import Airtable from 'airtable';

Airtable.configure({
	endpointUrl: 'https://api.airtable.com',
	apiKey: 'key8N24RInkvmsEgD'
});

let patterns = Airtable.base('appRtVtmOW4oibIij');
let portfolio = Airtable.base('appfed8INlDShDOoQ');

export default Airtable;
export { patterns, portfolio };
