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
		<Extract extract={selected} class="card" />
	{/if}

	{#if children}
		{#each children as child (child.id)}
			<Extract extract={child} />
		{/each}
	{/if}

	{#if connections}
		<div class="connections">
			<hr />
			<span class="text-secondary">⮂</span>
			<hr />
		</div>
		{#each connections as connection (connection.id)}
			<Extract extract={connection} />
		{/each}
	{/if}
</article>

<style lang="scss">
	article {
		max-width: 600px;
		margin-inline: auto;
		display: flex;
		flex-direction: column;
		gap: 2em;
	}

	.connections {
		display: flex;
		align-items: center;
		gap: 1em;

		hr {
			flex: 1;
		}
	}
</style>
