<script>
	import markdown from '../helpers/markdown';
	import slugify from '../helpers/slugify';
	import get from '../helpers/get';
	import Citation from './Citation.svelte';
	import InternalLink from './InternalLink.svelte';
	import ImageCarousel from './ImageCarousel.svelte';

	export let extract = {};
	export let suppressCitation = false;
	export let idPrefix = '';

	const isWork = get(extract, 'is_work')

	const title = get(extract, 'title');
	const slug = get(extract, 'slug', slugify(title));
	const parentSlug = get(extract, 'parent_slug[0]');
	const text = get(extract, 'extract', '');
	const notes = get(extract, 'notes');
	const topics = get(extract, 'space_topics');

	const elementId = idPrefix ? `${idPrefix}--${slug}` : slug;

	const childTitles = get(extract, 'child_titles');
	const connectionTitles = get(extract, 'connection_titles'); 

	const images = get(extract, 'extract_image');
	const imageCaption = get(extract, 'image_caption');

	const logClicks = false;

	const maxChildren = 5;
	let showAllChildren = false;
	$: truncatedChildren = !showAllChildren && (childTitles && childTitles.length > maxChildren);
</script>

<article id="{elementId}" class="extract {isWork ? 'extract--work' : 'extract--fragment'}" on:click="{(e) => logClicks && console.log(extract) }">
	{#if title}
	<header>
		<h2 class="extract-title"><InternalLink toExtract="{isWork ? slug : parentSlug}" toFragment="{isWork ? '' : slug}">{title}</InternalLink></h2>
	</header>
	{/if}
	<figure class="extract-main">
		{#if isWork}
		<figcaption class="extract-caption"><Citation {extract} {suppressCitation} /></figcaption>
		{/if}
		{#if images}
		<ImageCarousel {images} {imageCaption} />
		{/if}
		{#if text}
		<blockquote class="extract-text markdown-block" cite={extract.source}>
			{@html markdown.render(text)}
		</blockquote>
		{/if}
		{#if !isWork}
		<figcaption class="extract-caption"><Citation {extract} {suppressCitation} /></figcaption>
		{/if}
	</figure>
	{#if childTitles || connectionTitles || topics}
	<section>
		{#if childTitles}
		<ol class="linked-list extract-children">
			{#each childTitles as child, i}
			{#if truncatedChildren && i > maxChildren}
			<!-- Don't render anything. -->
			{:else if truncatedChildren && i === maxChildren}
			<li><button on:click="{() => showAllChildren = true}" class="link caption">+{childTitles.length - maxChildren} More</button></li>
			{:else}
			<li>&ZeroWidthSpace;<InternalLink class="link link--child" toExtract="{slug}" toFragment="{slugify(child)}">&ZeroWidthSpace;{child}&ZeroWidthSpace;</InternalLink>&ZeroWidthSpace;</li>
			{/if}
			{/each}
		</ol>
		{/if}
		{#if connectionTitles}
		<ol class="linked-list extract-connections">
			{#each connectionTitles as connection}
			<li>&ZeroWidthSpace;<InternalLink class="link link--connection" toExtract="{slugify(connection)}">&ZeroWidthSpace;{connection}&ZeroWidthSpace;</InternalLink>&ZeroWidthSpace;</li>
			{/each}
		</ol>
		{/if}
		{#if topics}
		<ul class="extract-spaces">
			{#each topics as topic}
			<li><InternalLink class="topic" toType="spaces" toEntity="{topic}">{topic}</InternalLink></li>
			{/each}
		</ul>
		{/if}
	</section>
	{/if}
	{#if notes}
	<footer class="caption markdown-block">
		{@html markdown.render(notes)}
	</footer>
	{/if}
</article>

<style>
	.extract-title > :global(a) {
		font-family: inherit;
		color: var(--text-primary);
		font-size: inherit;
		line-height: inherit;
	}

	.extract-main {
		display: flex;
		flex-direction: column;
	}

	.extract-text {
		padding: 0;
		border: none;
		font-style: inherit;
		font-size: inherit;
		font-family: inherit;
	}

	.extract-caption:empty {
		display: none;
	}

	section > * {
		--spacing: 0.5em;
		font-size: var(--font-size-0);
	}

	.linked-list {
		--separation: 0.5rem;
		position: relative;
		padding-left: 20px;
		list-style-position: inside;
		list-style-type: none;
		color: var(--text-secondary);
	}

	.linked-list::before {
		position: absolute;
		left: 0;
	}

	.extract-children::before {
		content: '↳';
	}

	.extract-connections::before {
		content: '⮂';
	}

	.linked-list :global(*) {
		display: inline;
	}

	.linked-list > li:not(:last-child) {
		margin-right: var(--separation);
	}

	.linked-list > li + li::before {
		content: '/';
		color: var(--text-tertiary);
		margin-right: var(--separation);
	}

	.extract-spaces {
		--spacing: 1em;
		list-style-type: none;
		margin-bottom: 0;
		margin-left: calc(-1 * var(--spacing));
		display: flex;
		flex-wrap: wrap;
		max-width: 100%;
	}

	.extract-spaces > li {
		margin-left: var(--spacing);
	}

	:global(.topic) {
		color: var(--text-secondary);
		text-transform: uppercase;
		white-space: nowrap;
	}

	:global(.topic::before) {
		content: '#';
		opacity: 0.5;
		display: inline-block;
		margin-right: 2px;
	}

	footer {
		border-top: 1px solid var(--divider);
		padding-top: 1rem;
		margin-top: 1rem;
	}
</style>

