<script>
	import { flip } from 'svelte/animate';

	import Extract from './Extract.svelte';
	import Card from './Card.svelte';
	
	export let creator;
	export let space;
	export let extracts;
</script>

<div class="wrapper">
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
		{#each extracts as extract (extract.full_slug)}
		<li animate:flip="{{duration: 500}}">
			<Card>
				<Extract {extract} />
			</Card>			
		</li>
		{/each}		
	</ul>
</div>

<style>
	.wrapper {
		width: 500px;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	header > h1::first-letter {
		text-transform: capitalize;
	}
	
	.extract-list {
		margin-top: 2rem;
		list-style-type: none;
	}

	.extract-list > :global(* + *) {
		margin-top: 1rem;
	}

	.extract-list :global(.extract + .extract) {
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 1px solid var(--divider);
	}	
</style>
