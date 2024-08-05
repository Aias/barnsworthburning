<script lang="ts">
	import { setContext } from 'svelte';
	import { makeHierarchy } from '$helpers/mapping';
	import Extract from '$components/Extract.svelte';
	import ExtractList from './ExtractList.svelte';
	import type { IExtract } from '$types/Airtable';

	interface ExtractItemProps {
		selectedId: string;
		extracts: IExtract[];
	}
	let { selectedId, extracts }: ExtractItemProps = $props();

	let { selected, children, connections } = $derived(makeHierarchy(extracts, selectedId));

	$effect.pre(() => {
		setContext('extract', selected);
	});

	let title = $derived(selected?.title || 'Extract');
	let description = $derived(
		selected?.description || 'Explore this extract on barnsworthburning'
	);
</script>

<svelte:head>
	<title>{title} | barnsworthburning</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={`https://barnsworthburning.net/extract/${selected?.id}`} />
	{#if selected?.image}
		<meta property="og:image" content={selected.image[0].url} />
	{/if}
	{#if selected?.creators && selected.creators.length > 0}
		<meta name="author" content={selected.creators.map((creator) => creator.name).join(', ')} />
	{/if}
	{#if selected?.date_published}
		<meta property="article:published_time" content={selected.date_published} />
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
		<ExtractList extracts={connections} />
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

	.connections-separator ~ :global(*) {
		font-size: var(--font-size-small);
	}
</style>
