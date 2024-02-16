<script lang="ts">
	import markdown from '$helpers/markdown';

	import Link from './Link.svelte';
	import Citation from './Citation.svelte';
	import TopicList from './TopicList.svelte';
	import RelationList from './RelationList.svelte';
	import AirtableImage from './AirtableImage.svelte';
	import type { Extract } from '$types/Extract';

	interface ExtractProps {
		extract: Extract;
		contextId?: string;
		componentClass?: string;
	}

	let { extract, contextId = 'panel', componentClass } = $props<ExtractProps>();

	let id = $derived(extract.id);
	let title = $derived(extract.title);
	let extractContent = $derived(extract.extract);
	let notes = $derived(extract.notes);
	let images = $derived(extract.images);
	let imageCaption = $derived(extract.imageCaption);

	let parent = $derived(extract.parent);
	let children = $derived(extract.children);
	let connections = $derived(extract.connections);
	let spaces = $derived(extract.spaces);

	let hasRelations = $derived(children || connections || spaces);
	let nodeId = $derived(`${contextId}--${id}`);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<section id={nodeId} class:extract={true} class:interactive={true} class={componentClass}>
	{#if title}
		<header>
			<h2 class="extract-title">
				{#if parent}
					<Link toExtract={parent.id} childAnchor={`panel--${id}`}>{title}</Link>
				{:else}
					<Link toExtract={id}>{title}</Link>
				{/if}
			</h2>
		</header>
	{/if}
	<figure class="extract-main">
		{#if images}
			<AirtableImage image={images[0]} />
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
			<RelationList items={children} symbol="↳" label="Children" />
			<RelationList items={connections} symbol="⮂" label="Connections" />
			<TopicList topics={spaces} />
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
