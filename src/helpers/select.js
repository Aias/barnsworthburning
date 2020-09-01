import { FULL_API } from '../config.js';
import { siteError } from '../stores';

export default (table = 'extracts', options = {}) => async (fetch) => {
	let error;
	const records = await fetch(
		`${FULL_API}/airtableGet?base=barnsworthburning&table=${table}&options=${JSON.stringify(options)}`
	)
		.then((data) => data.json())
		.catch((e) => {
			console.error(e);
			error = e;
		});

	return {
		records,
		error
	};
};
