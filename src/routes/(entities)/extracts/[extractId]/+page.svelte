<script lang="ts">
	import cache from '$lib/cache.svelte';
	import { makeHierarchy } from '$lib/extractHierarchy.svelte';
	import { page } from '$app/stores';
	import Extract from '$components/Extract.svelte';

	let { data } = $props();

	$effect(() => {
		cache.addExtracts(data.selectedExtractData);
	});

	let tree = $derived(makeHierarchy($page.params.extractId).full);
	let selected = $derived(tree?.selected);
	let parents = $derived(tree?.parents);
	let children = $derived(tree?.children);
	let connections = $derived(tree?.connections);
</script>

<article>
	{#if parents}
		{#each parents as parent (parent.id)}
			<Extract extract={parent} />
		{/each}
	{/if}

	{#if selected}
		<Extract extract={selected} class="card chromatic" />
	{/if}

	{#if children}
		{#each children as child (child.id)}
			<Extract extract={child} />
		{/each}
	{/if}

	{#if connections}
		<div class="connections-separator" role="presentation">
			<hr />
			<span class="text-secondary text-mono">See ⮂ Also</span>
			<hr />
		</div>
		<ul class="connections block-list">
			{#each connections as connection (connection.id)}
				<Extract element="li" extract={connection} />
			{/each}
		</ul>
	{/if}
</article>

<style>
	article {
		max-width: 600px;
		margin-inline: auto;
		display: flex;
		flex-direction: column;
		gap: 2em;
	}

	.connections-separator {
		display: flex;
		align-items: center;
		gap: 1em;

		hr {
			flex: 1;
		}
	}

	.connections {
		font-size: var(--font-size-small);
	}
</style>
