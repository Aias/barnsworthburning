<script lang="ts">
	import markdown from '$helpers/markdown';
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

	let airtableUrl = $derived(
		`https://airtable.com/${AirtableBaseId}/${Table.Extracts}/${ExtractView.EntryView}/${extract.id}`
	);

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
	let nodeId = $derived(`${contextId}--${id}`);

	const handleClick = (event: MouseEvent) => {
		if (interaction.metaKeyPressed) {
			event.preventDefault();
			window.open(airtableUrl, '_blank');
		}
	};
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<section id={nodeId} class:extract={true} class={className} onclick={handleClick}>
	{#if title}
		<header>
			<h2 class="extract-title">
				<Link toId={id}>
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
</section>

<style lang="scss">
	.extract {
		--layout-gap: 0.5em;
		display: flex;
		flex-direction: column;
		gap: var(--layout-gap);
		position: relative;
		isolation: isolate;
	}

	.extract-title {
		> :global(a) {
			all: inherit;
			cursor: pointer;
			word-wrap: break-word;
			&:hover {
				text-decoration: underline;
			}
		}
	}

	.extract-main {
		display: flex;
		flex-direction: column;
		gap: var(--layout-gap);
		color: var(--display);
	}

	.extract-image {
		border: 1px solid var(--divider);
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
