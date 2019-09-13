<script>
	import range from 'lodash/range';
	import { goto } from '@sapper/app';
	import getApproximateExtractLength from '../helpers/getApproximateExtractLength';

	import Extract from './Extract.svelte';
	import Card from './Card.svelte';
	import Loading from './Loading.svelte';

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
				sortScore: getApproximateExtractLength(e)
			})).sort((a, b) => { return b.sortScore - a.sortScore; });

			sortedExtracts.forEach((e, i) => {
				colContents[i % numCols].push(e);
			});

			layout = colContents.map(col => col.sort((a, b) => { 
				return a.originalOrder - b.originalOrder;
			}));	
		}
	}
</script>

{#if extracts}
<div class="layout-container" bind:clientWidth={containerWidth}>
	{#if containerWidth > 0}
	{#each layout as column}
	<div class="layout-col">
		{#each column as { extract }}
		<Card onClick="{() => goto(`/extracts/${extract.id}`)}">
			<Extract {extract} isCompact />
		</Card>
		{/each}
	</div>
	{/each}
	{/if}
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
	:global(.card:hover header) {
		color: var(--theme-primary-text);
	}
</style>