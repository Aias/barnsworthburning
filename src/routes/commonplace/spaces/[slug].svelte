<script context="module">
	import spaceNames from '../../../data/spaces';
	import { FULL_API } from '../../../config';

	export async function preload(page, session) {
		const { params, query } = page;

		let { slug } = params;
		let id = spaceNames[slug] || spaceNames['i'];

		let options = {
			view: 'spaces',
			filterByFormula: `IF(FIND("${id}", ARRAYJOIN(space_ids, ",")) > 0, TRUE(), FALSE())`
		};

		let extracts = await this.fetch(
			`${FULL_API}/airtableGet?base=commonplace&table=extracts&options=${JSON.stringify(
				options
			)}`
		).then(data => data.json())
		.catch(error => {
			console.log(error);
			return [];
		});

		return { extracts };
	}
</script>

<script>
	import { stores } from '@sapper/app';
	import { selectedSpace } from '../../../stores';
	import Space from '../../../components/Space.svelte';

	export let extracts = undefined;
	
	let { page } = stores();

	$: {
		let { slug } = $page.params;
		if(slug) { selectedSpace.set(slug); }
	}
</script>

<Space {extracts} />