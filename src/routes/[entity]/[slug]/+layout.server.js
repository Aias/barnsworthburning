import { airtableFetch } from '$lib/server/requests';

export async function load({ params }) {
	const { entity, slug } = params;
	let creator, space;

	switch (entity) {
		case 'creators':
			const creators = await airtableFetch('creators', {
				filterByFormula: `slug = "${slug}"`
			});
			if (creators) creator = creators[0];
			break;
		case 'spaces':
			const spaces = await airtableFetch('spaces', {
				filterByFormula: `topic = "${slug}"`
			});
			if (spaces) space = spaces[0];
			break;
		default:
			console.error(`Unknown entity: ${entity}`);
	}

	if (creator || space) {
		const extractsArr = creator ? creator.extracts : space.extracts;
		const extractIds = extractsArr.join(',');

		const extracts = await airtableFetch('extracts', {
			filterByFormula: `FIND(RECORD_ID(), "${extractIds}") > 0`,
			view: 'By Relevance'
		});

		return {
			creator,
			space,
			extracts
		};
	} else {
		return {
			error: 'Failed to fetch.'
		};
	}
}
