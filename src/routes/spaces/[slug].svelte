<script context="module">
	import { FULL_API } from '../../config';

	export async function preload(page, session) {
		const { params, query } = page;

		let { slug } = params;
		const searchSlug = `,${slug},`;

		// TODO: Only bring back needed fields.
		let options = {
			view: 'spaces',
			filterByFormula: `IF(FIND("${searchSlug}", CONCATENATE(",", ARRAYJOIN(space_names), ",")) > 0, TRUE(), FALSE())`
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
	import Space from '../../components/Space.svelte';

	export let extracts = undefined;
</script>

<Space {extracts} />