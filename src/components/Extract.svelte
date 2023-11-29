<script>
	import markdown from '$helpers/markdown';

	import Citation from './Citation.svelte';
	import TopicList from './TopicList.svelte';
	import RelationList from './RelationList.svelte';

	export let extract,
		idPrefix = 'extract';

	$: id = extract.id;
	$: isWork = extract.isWork;
	$: title = extract.title;
	$: extractContent = extract.extract;
	$: notes = extract.notes;
	$: images = extract.images;
	$: imageCaption = extract.imageCaption;

	$: children = extract.children;
	$: connections = extract.connections;
	$: spaces = extract.spaces;

	$: hasRelations = children || connections || spaces;
	$: nodeId = idPrefix ? `${idPrefix}--${id}` : id;
</script>

<article id={nodeId} class="extract {isWork ? 'extract--work' : 'extract--fragment'}">
	{#if title}
		<header>
			<h2 class="extract-title">{title}</h2>
		</header>
	{/if}
	<figure class="extract-main">
		{#if images}
			<img alt="yes" />
			{#if imageCaption}
				<p class="extract-image-caption">{imageCaption}</p>
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
