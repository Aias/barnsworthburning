import { airtableFetch } from '$lib/server/requests';

export async function load({ params }) {
	const { extract: extractSlug } = params;

	const filterString = `OR(CONCATENATE('-', slug, '-') = '-${extractSlug}-', FIND('${extractSlug}', parent_slug) = 1)`; // Returns true if an extract has the same slug (it is the parent) or if its parent has the same slug (it's a child of the extract we're looking for).

	const records = await airtableFetch('extracts', {
		filterByFormula: filterString
	});

	if (records) {
		return {
			extracts: records,
			currentSlug: extractSlug
		};
	} else {
		return {
			error: 'Failed to fetch'
		};
	}
}
