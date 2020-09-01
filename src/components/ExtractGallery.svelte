<script>
	export let creator;
	export let space;
	export let extracts;

	import Extract from './Extract.svelte';
	import Card from './Card.svelte';
	import Close from './icons/Close.svelte';
	import Arrow from './icons/Arrow.svelte';
	import InternalLink from './InternalLink.svelte';

	import { flip } from 'svelte/animate';
	import { stores } from '@sapper/app';
	const { page } = stores();

	$: params = $page.params;
	$: selectedExtract = params.extract;
</script>

<header>
	<h1>
		{#if creator}
		{creator.full_name}
		{:else}
		{space.title || space.topic}
		{/if}
	</h1>
	{#if selectedExtract}
	<InternalLink toExtract={false} title="Hide right-hand reading panel" aria-label="Hide reading panel">
		<Arrow direction="right" />
	</InternalLink>
	{:else}
	<InternalLink toIndex title="Close gallery (back to index)" aria-label="Close gallery (back to index)">
		<Close />
	</InternalLink>
	{/if}
</header>
<ul class="extract-list">
	{#each extracts as extract (extract.slug)}
	<li animate:flip="{{duration: 500}}">
		<Card>
			<Extract {extract} />
		</Card>			
	</li>
	{/each}		
</ul>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	header > :global(a) {
		text-align: right;
		font-size: 1rem;
	}

	header > h1::first-letter {
		text-transform: capitalize;
	}
	
	.extract-list {
		margin-top: 2rem;
		list-style-type: none;
		column-width: 35ch;
	}

	.extract-list > * {
		margin-bottom: 1rem;
		-webkit-column-break-inside: avoid;
		page-break-inside: avoid;
		break-inside: avoid;
		/* Baffling Safari bug that causes parts of certain children
		   to disappear when using CSS columns, but only for items that are
		   not in the very first column.
		   
		   See: https://stackoverflow.com/questions/29624396/when-using-column-count-overflowing-content-completely-disappears-in-all-but-fi  */
		-webkit-transform: translateX(0);
		-moz-transform: translateX(0);
		transform: translateX(0);
	}
</style>
