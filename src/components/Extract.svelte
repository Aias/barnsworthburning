<script lang="ts">
	import markdown from '$helpers/markdown';
	import BlockLink from './BlockLink.svelte';
	import Citation from './Citation.svelte';
	import TopicList from './TopicList.svelte';
	import RelationList from './RelationList.svelte';
	import AirtableImage from './AirtableImage.svelte';
	import Link from './Link.svelte';
	import { AirtableBaseId, ExtractView, Table, type IExtract } from '$types/Airtable';
	import { classnames } from '$helpers/classnames';

	interface ExtractProps {
		extract: IExtract;
		contextId?: string;
		class?: string;
		element?: string;
	}

	let { extract, element = 'section', class: className }: ExtractProps = $props();

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

	let airtableUrl = $derived(
		`https://airtable.com/${AirtableBaseId}/${Table.Extracts}/${ExtractView.EntryView}/${extract.id}`
	);
	const openInAirtable = (event: MouseEvent) => {
		event.preventDefault();
		window.open(airtableUrl, '_blank');
	};
</script>

<BlockLink {element} class={classnames('extract', 'ssm-container', className)}>
	{#if title}
		<header>
			<h2 class="extract-title">
				<Link toId={id} class="main-link inherit">
					{title}
				</Link>
			</h2>
			<button
				class="ssm source-opener chromatic"
				onclick={openInAirtable}
				title="Open in Airtable">☁️</button
			>
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
		<Citation {extract} element="figcaption" class="extract-caption" />
		{#if extractContent}
			<blockquote class="extract-text content" cite={extract.source}>
				{@html markdown.parse(extractContent)}
			</blockquote>
		{/if}
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

	header {
		position: relative;
	}
	.source-opener {
		position: absolute;
		inset-block-start: 0;
		inset-inline-end: 0;
		line-height: 1;
		padding-block: 0.5cap;
		font-family: var(--font-stack-sans);
		font-size: var(--font-size-small);
		opacity: 50%;
		transition: opacity 150ms;
	}
	:global(.extract):hover .source-opener {
		opacity: 1;
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
