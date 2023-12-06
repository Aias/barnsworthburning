<script>
	import markdown from '$helpers/markdown';

	import Citation from './Citation.svelte';
	import TopicList from './TopicList.svelte';
	import RelationList from './RelationList.svelte';

	let { extract, contextId = 'panel', class: className } = $props();

	extract; // I do not know why this declaration is necessary, but it appears to prevent errors when a prop is updated via an async API call.

	let id = $derived(extract?.id);
	let title = $derived(extract?.title);
	let extractContent = $derived(extract?.extract);
	let notes = $derived(extract?.notes);
	let images = $derived(extract?.images?.[0]);
	let imageCaption = $derived(extract?.imageCaption);

	let children = $derived(extract?.children);
	let connections = $derived(extract?.connections);
	let spaces = $derived(extract?.spaces);

	let hasRelations = $derived(children || connections || spaces);
	let nodeId = $derived(contextId ? `${contextId}--${id}` : id);
</script>

<article id={nodeId} class:extract class={className}>
	{#if title}
		<header>
			<h2 class="extract-title">{title}</h2>
		</header>
	{/if}
	<figure class="extract-main">
		{#if images}
			<img class="extract-image" alt={images.filename} src={images.url} />
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
		<section class="relations">
			<RelationList items={children} symbol="↳" label="Children" />
			<RelationList items={connections} symbol="⮂" label="Connections" />
			<TopicList topics={spaces} />
		</section>
	{/if}
	{#if notes}
		<footer class="caption content">
			{@html markdown.render(notes)}
		</footer>
	{/if}
</article>

<style lang="scss">
	.extract {
		--layout-gap: 1em;
		display: flex;
		flex-direction: column;
		gap: var(--layout-gap);
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
