<script>
	import { flip } from 'svelte/animate';

	import Extract from './Extract.svelte';
	import Card from './Card.svelte';
	
	export let creator;
	export let space;
	export let extracts;
</script>

<header>
	<h1>
		{#if creator}
		{creator.full_name}
		{:else}
		{space.title || space.topic}
		{/if}
	</h1>
	<a href="/">Close Panel</a>
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

	header > a {
		text-align: right;
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
	}
</style>
