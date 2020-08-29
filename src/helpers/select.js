import { FULL_API } from '../config.js';

export default (table = 'extracts', options = {}) => async (fetch) => {
	const results = await fetch(
		`${FULL_API}/airtableGet?base=barnsworthburning&table=${table}&options=${JSON.stringify(options)}`
	)
		.then((data) => data.json())
		.catch((error) => {
			console.log(error);
			return [];
		});

	return results;
};
