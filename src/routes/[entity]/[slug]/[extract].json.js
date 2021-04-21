import { airtableFetch } from '../../_requests';

export async function get({ params }) {
	const { extract } = params;

	const filterString = `OR(CONCATENATE('-', slug, '-') = '-${extract}-', FIND('${extract}', parent_slug) = 1)`; // Returns true if an extract has the same slug (it is the parent) or if its parent has the same slug (it's a child of the extract we're looking for).

	const records = await airtableFetch('extracts', {
		filterByFormula: filterString
	});

	if (records) {
		return {
			body: records
		};
	} else {
		return {
			error: 'Failed to fetch'
		};
	}
}
