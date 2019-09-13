<script context="module">
	import spaceNames from './spaces/_spaces';
	import { spaces } from '../stores';
	import { FULL_API } from '../config';

	export async function preload(page, session) {
		let slug = 'i';
		let id = spaceNames[slug];
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

		return { extracts, space: slug };
	}
</script>

<script>
	import { selectedSpace } from '../stores';
	import Space from '../components/Space.svelte';

	export let extracts = undefined;
	export let space = undefined;

	$: {
		selectedSpace.set('everything');
	}
</script>

<Space {extracts} />