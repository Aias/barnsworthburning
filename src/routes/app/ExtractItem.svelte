<script lang="ts">
	import { setContext } from 'svelte';
	import { makeHierarchy } from '$helpers/mapping';
	import Extract from '$components/Extract.svelte';
	import ExtractList from './ExtractList.svelte';
	import type { IExtract } from '$types/Airtable';
	import { getArticle } from '$helpers/grammar';

	interface ExtractItemProps {
		selectedId: string;
		extracts: IExtract[];
	}
	let { selectedId, extracts }: ExtractItemProps = $props();

	let { selected, children, connections } = $derived(makeHierarchy(extracts, selectedId));

	$effect.pre(() => {
		setContext('extract', selected);
	});

	let title = $derived(selected.title || 'Extract');

	let description = $derived.by(() => {
		const type = selected.format || 'extract';
		const creators =
			(selected.creators || selected.parentCreators)?.map((c) => c.name).join(', ') ||
			'Unknown';
		const parent = selected.parent?.name || '';
		return `${getArticle(type)} ${type.toLowerCase()} by ${creators}${parent ? ` from ${parent}` : ''}`;
	});

	let modified = $derived.by(() => {
		const lastUpdated = new Date(selected.lastUpdated);
		const publishedOn = new Date(selected.extractedOn);
		return new Date(Math.max(lastUpdated.getTime(), publishedOn.getTime())).toISOString();
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title} />
	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content="barnsworthburning" />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={`https://barnsworthburning.net/extracts/${selectedId}`} />
	{#each selected.creators || [] as creator}
		<meta name="author" content={creator.name} />
		<meta property="og:article:author" content={creator.name} />
	{/each}
	{#each selected.images || [] as image}
		<meta property="og:image" content={image.url} />
	{/each}
	<meta
		property="og:article:published_time"
		content={new Date(selected.extractedOn).toISOString()}
	/>
	<meta property="og:article:modified_time" content={modified} />
</svelte:head>

<article>
	<Extract extract={selected} class="chromatic" variant="card" suppressBlockLink />

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
