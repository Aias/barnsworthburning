<script context="module">
	import spaces from './_spaces';
	import { FULL_API } from '../config';

	export async function preload(page, session) {
		const { params, query } = page;
		let space = query['📖'] || 'i';

		let id = spaces[space] || spaces['i'];
		let options = {
			view: 'spaces',
			filterByFormula: `IF(FIND("${id}", space_ids) > 0, TRUE(), FALSE())`
		};

		let extracts = await this.fetch(
			`${FULL_API}/airtableGet?base=commonplace&table=extracts&options=${JSON.stringify(
				options
			)}`
		).then(data => data.json());

		return { extracts };
	}
</script>

<script>
	import Extract from '../components/Extract.svelte';
	import Card from '../components/Card.svelte';
	import Loading from '../components/Loading.svelte';

	export let extracts;
</script>

{#if extracts}
<div>
	{#each extracts as extract}
	<Card>
		<Extract {extract} />
	</Card>
	{/each}
</div>
{:else}
<Loading />
{/if}

<style>
	:global(.card) {
		margin-bottom: 1rem;
	}
</style>
