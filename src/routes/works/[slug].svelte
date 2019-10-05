<script context="module">
	import { FULL_API } from '../../config';

	export async function preload(page, session) {
		const { params, query } = page;

		let { slug } = params;

		let options = {
			view: 'Grid view',
			filterByFormula: `LOWER(ARRAYJOIN(group_id, ",")) = LOWER('${slug}')`
		};

		let extracts = await this.fetch(
			`${FULL_API}/airtableGet?base=commonplace&table=extracts&options=${JSON.stringify(
				options
			)}`
		)
			.then(data => data.json())
			.catch(error => {
				console.log(error);
				return [];
			});

		return { extracts };
	}
</script>

<script>
	import { selectedSpace } from '../../stores';
	import Extract from '../../components/Extract.svelte';

	export let extracts = undefined;
</script>

{#each extracts as extract}
	<Extract {extract} listed />
{/each}

<style>
	:global(.listed + .listed:before) {
		content: '· · ·';
		display: block;
		margin-top: 1.5rem;
		margin-bottom: 1rem;
		text-align: center;
		color: var(--theme-accent-text);
	}
</style>
