<script lang="ts">
	import { setContext } from 'svelte';
	import cache from '$lib/cache.svelte';
	import { makeHierarchy } from '$lib/extractHierarchy.svelte';
	import { page } from '$app/stores';
	import Extract from '$components/Extract.svelte';

	let { data } = $props();

	$effect.pre(() => {
		cache.addExtracts(data.selectedExtractData);
	});

	let tree = $derived(makeHierarchy($page.params.extractId));
	let selected = $derived(tree.selected);
	let children = $derived(tree.children);
	let connections = $derived(tree.connections);

	$effect.pre(() => {
		setContext('extract', selected);
	});
</script>

<svelte:head>
	{#if selected?.title}
		<title>{selected.title}</title>
	{/if}
</svelte:head>
<article>
	{#if selected}
		<Extract extract={selected} class="chromatic" variant="card" suppressBlockLink />
	{/if}

	{#if children}
		{#each children as child (child.id)}
			<Extract extract={child} suppressBlockLink />
		{/each}
	{/if}

	{#if connections}
		<div class="connections-separator" role="presentation">
			<hr />
			<small class="text-secondary text-mono">See ⮂ Also</small>
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
