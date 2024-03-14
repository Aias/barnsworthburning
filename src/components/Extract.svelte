<script lang="ts">
	import markdown from '$helpers/markdown';
	import { AirtableBaseId } from '$types/Airtable';
	import Citation from './Citation.svelte';
	import TopicList from './TopicList.svelte';
	import RelationList from './RelationList.svelte';
	import AirtableImage from './AirtableImage.svelte';
	import type { IExtract } from '$types/Airtable';

	interface ExtractProps {
		extract: IExtract;
		contextId?: string;
		componentClass?: string;
	}

	let { extract, contextId = 'panel', componentClass }: ExtractProps = $props();

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
</script>

<section id={nodeId} class:extract={true} class:interactive={true} class={componentClass}>
	{#if title}
		<header>
			<h2 class="extract-title">
				<a
					href={`https://airtable.com/${AirtableBaseId}/tblACVIEZW68A1mMZ/${id}`}
					target="_blank"
					rel="noopener"
				>
					{title}
				</a>
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
					{@html markdown.render(imageCaption)}
				</div>
			{/if}
		{/if}
		{#if extractContent}
			<blockquote class="extract-text content" cite={extract.source}>
				{@html markdown.render(extractContent)}
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
			{@html markdown.render(notes)}
		</footer>
	{/if}
</section>

<style lang="scss">
	.extract {
		--layout-gap: 1em;
		display: flex;
		flex-direction: column;
		gap: var(--layout-gap);
		position: relative;
		isolation: isolate;
	}

	.extract-title {
		> :global(a) {
			all: inherit;
			display: inline-block;
			&:hover {
				text-decoration: underline;
			}
		}
	}

	.extract-main {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		color: var(--display);
	}

	.extract-image {
		border: 1px solid var(--divider);
	}

	.extract-caption {
		order: -1;
	}

	.extract-text {
		all: inherit; /* Remove default blockquote styling as it's being used only as a semantic element. */
	}

	.relations {
		font-size: var(--font-size-small);
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}

	footer {
		border-top: 1px solid var(--divider);
		padding-top: var(--layout-gap);
	}
</style>
