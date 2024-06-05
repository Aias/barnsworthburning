<script lang="ts">
	import markdown from '$helpers/markdown';
	import BlockLink from './BlockLink.svelte';
	import Citation from './Citation.svelte';
	import TopicList from './TopicList.svelte';
	import RelationList from './RelationList.svelte';
	import AirtableImage from './AirtableImage.svelte';
	import Link from './Link.svelte';
	import { AirtableBaseId, ExtractView, Table, type IExtract } from '$types/Airtable';
	import interaction from '$lib/interaction.svelte';

	interface ExtractProps {
		extract: IExtract;
		contextId?: string;
		class?: string;
	}

	let { extract, contextId = 'panel', class: className }: ExtractProps = $props();

	// let airtableUrl = $derived(
	// 	`https://airtable.com/${AirtableBaseId}/${Table.Extracts}/${ExtractView.EntryView}/${extract.id}`
	// );

	let id = $derived(extract.id);
	let title = $derived(extract.title);
	let extractContent = $derived(extract.extract);
	let notes = $derived(extract.notes);
	let images = $derived(extract.images);
	let imageCaption = $derived(extract.imageCaption);

	let children = $derived(extract.children);
	let connections = $derived(extract.connections);
	let spaces = $derived(extract.spaces);

	let hasRelations = $derived(children || connections || spaces);

	// const handleClick = (event: MouseEvent) => {
	// 	if (interaction.metaKeyPressed) {
	// 		event.preventDefault();
	// 		window.open(airtableUrl, '_blank');
	// 	}
	// };
</script>

<BlockLink element="section" class={className ? `extract ${className}` : 'extract'}>
	{#if title}
		<header>
			<h2 class="extract-title">
				<Link toId={id} class="main-link inherit">
					{title}
				</Link>
			</h2>
		</header>
	{/if}
	<figure class="extract-main">
		{#if images}
			{#each images as image (image.id)}
				<AirtableImage {image} />
			{/each}
			{#if imageCaption}
				<div class="extract-image-caption caption content">
					{@html markdown.parse(imageCaption)}
				</div>
			{/if}
		{/if}
		{#if extractContent}
			<blockquote class="extract-text content" cite={extract.source}>
				{@html markdown.parse(extractContent)}
			</blockquote>
		{/if}
		<figcaption class="extract-caption">
			<Citation {extract} />
		</figcaption>
	</figure>
	{#if hasRelations}
		<nav class="relations">
			{#if children}<RelationList items={children} symbol="↳" label="Children" />{/if}
			{#if connections}<RelationList
					items={connections}
					symbol="⮂"
					label="Connections"
				/>{/if}
			{#if spaces}<TopicList topics={spaces} />{/if}
		</nav>
	{/if}
	{#if notes}
		<footer class="caption content">
			{@html markdown.parse(notes)}
		</footer>
	{/if}
</BlockLink>

<style>
	:global(.extract) {
		--layout-gap: 0.5em;
		display: flex;
		flex-direction: column;
		gap: var(--layout-gap);
		position: relative;
		isolation: isolate;
	}

	.extract-main {
		display: flex;
		flex-direction: column;
		gap: var(--layout-gap);
		color: var(--display);
	}

	:global(.extract img) {
		background-color: var(--paper);
		border: 1px solid var(--flood);
	}

	.extract-caption {
		order: -1;
	}

	.extract-text {
		all: unset; /* Remove default blockquote styling as it's being used only as a semantic element. */
	}

	.relations {
		font-size: var(--font-size-small);
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

	footer {
		border-block-start: 1px solid var(--divider);
		padding-block-start: var(--layout-gap);
	}
</style>
