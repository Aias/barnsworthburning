<script>
	import markdown from '$helpers/markdown';
	import zip from '$helpers/zip';

	import TopicList from './TopicList.svelte';
	import RelationList from './RelationList.svelte';
	import CreatorList from './CreatorList.svelte';

	const { extract, idPrefix = 'extract' } = $props();

	let {
		id,
		isWork,
		title,
		extract: extractContent,
		parent: parentId, // Actually an array
		parentTitle, // Actually an array
		creators: creatorIds,
		creatorNames,
		notes,
		spaces: spaceIds,
		spaceTopics,
		children: childIds,
		childTitles,
		connections: connectionIds,
		connectionTitles,
		images,
		imageCaption
	} = extract;

	const parent = parentId ? { id: parentId[0], name: parentTitle[0] } : null;
	const creators = zip(['id', 'name'], creatorIds, creatorNames);
	const children = zip(['id', 'name'], childIds, childTitles);
	const connections = zip(['id', 'name'], connectionIds, connectionTitles);
	const spaces = zip(['id', 'name'], spaceIds, spaceTopics);

	let hasRelations = childTitles || connectionTitles || spaceTopics;

	const nodeId = idPrefix ? `${idPrefix}--${id}` : id;
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
			<CreatorList {creators} />
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
	}

	.extract--work .extract-caption {
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
