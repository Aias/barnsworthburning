<script>
	import markdown from '$helpers/markdown';
	import slugify from '$helpers/slugify';
	import TopicList from './TopicList.svelte';
	import RelationList from './RelationList.svelte';

	let { extract, idPrefix = 'extract' } = $props();

	let {
		isWork,
		title,
		slug,
		extract: extractContent,
		notes,
		spaceTopics,
		childTitles,
		connectionTitles,
		images,
		imageCaption
	} = extract;

	slug = slug || slugify(title);
	extractContent = extractContent || '';

	let hasRelations = childTitles || connectionTitles || spaceTopics;

	const nodeId = idPrefix ? `${idPrefix}--${slug}` : slug;
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
		{/if}
		{#if extractContent}
			<blockquote class="extract-text content" cite={extract.source}>
				{@html markdown.render(extractContent)}
			</blockquote>
		{/if}
		<figcaption class="extract-caption"><a href="/">Christopher Alexander</a></figcaption>
	</figure>
	{#if hasRelations}
		<section class="relations">
			<RelationList items={childTitles} symbol="↳" label="Children" />
			<RelationList items={connectionTitles} symbol="⮂" label="Connections" />
			<TopicList {spaceTopics} />
		</section>
	{/if}
	{#if notes || true}
		<footer class="caption content">
			{@html markdown.render(notes)} Rather than 'UI is not UX!', consider instead, 'the interface <em>is</em> the
			experience.'
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
