<script context="module">
	import { goto } from '@sapper/app';
	import spaceNames from '../helpers/spaces';
	import { spaces, selectedSpace } from '../stores';
	import { FULL_API } from '../config';

	export async function preload(page, session) {
		const { params, query } = page;
		let space = query['📖'] || 'i';
		selectedSpace.set(space);

		let id = spaceNames[space].id || spaceNames['i'].id;
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
	import range from 'lodash/range';
	import get from 'lodash/get';

	import Extract from '../components/Extract.svelte';
	import Card from '../components/Card.svelte';
	import Loading from '../components/Loading.svelte';

	export let extracts;

	const minColWidth = 333;
	let containerWidth = 0;
	$: numCols = Math.max(Math.floor(containerWidth / minColWidth), 1);
	let layout = [];

	$: {
		if(extracts) {
			let colContents = range(numCols).map(c => ([]));
			let sortedExtracts = [...extracts].map((e, i) => ({
				extract: e, 
				originalOrder: i, 
				sortScore: getApproxLengthForExtract(e)
			})).sort((a, b) => { return b.sortScore - a.sortScore; });

			sortedExtracts.forEach((e, i) => {
				colContents[i % numCols].push(e);
			});

			layout = colContents.map(col => col.sort((a, b) => { 
				return a.originalOrder - b.originalOrder;
			}));			
		}
	}
	
	const getApproxLengthForExtract = (e) => {
		let fields = [
			{field: 'title', weight: 4},
			{field: 'extract_text', weight: 1},
			{field: 'image_caption', weight: 0.75},
			{field: 'notes', weight: 0.75},
		];
		let hasImage = typeof e['extract_image'] === 'object'; // TODO: Update to handle multiple images, and use width/height fields to make more accurate predictions.
		let score = fields.reduce((prev, cur) => {
			return prev + get(e, cur.field, '').length;
		}, 0);

		if(hasImage) score += 500;

		return score;
	}
</script>

{#if extracts}
<div class="layout-container" bind:clientWidth={containerWidth}>
	{#each layout as column}
	<div class="layout-col">
		{#each column as { extract }}
		<Card onClick="{() => goto(`/commonplace/extracts/${extract.id}`)}">
			<Extract {extract} isCompact />
		</Card>
		{/each}
	</div>
	{/each}
</div>
{:else}
<Loading />
{/if}

<style>
	/* Svelte adds an object element to calculate container sizes,
	but doesn't include the CSS to mask them for screen readers. */
	:global(object) {
		visibility: hidden;
	}

	.layout-container {
		display: flex;
	}

	.layout-col {
		flex-grow: 1;
		flex-basis: 0;
	}

	.layout-col:not(:first-of-type) {
		margin-left: 1rem;
	}

	:global(.card) {
		margin-bottom: 1rem;
	}
</style>
