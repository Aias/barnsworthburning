<script>
	import markdown from '../helpers/markdown';
	import slugify from '../helpers/slugify';
	import get from '../helpers/get'
	import Link from './Link.svelte';
	import Citation from './Citation.svelte';

	import { stores } from '@sapper/app';
	const { page } = stores();

	let entity, entitySlug, extractSlug, fragmentSlug;
	$: {
		const { params } = $page;
		entity = params.entity;
		entitySlug = params.slug;
		if(params.extract) {
			extractSlug = params.extract[0];
			fragmentSlug = params.extract[1];
		}
	}

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

	let titleLink;

	$: {
		const rootPath = [entity, entitySlug];
		const fullPath = isWork ? rootPath.concat([slug]) : rootPath.concat([parentSlug, slug]);

		titleLink = `/${fullPath.join('/')}`;
	}
</script>

<article id="{elementId}" class="extract {isWork ? 'extract--work' : 'extract--fragment'}" on:click="{(e) => console.log(extract, $page.params) }">
	{#if title}
	<header>
		<h2 class="extract-title"><a href="{titleLink}">{title}</a></h2>
	</header>
	{/if}
	<figure class="extract-main">
		{#if isWork}
		<figcaption class="extract-caption"><Citation {extract} {suppressCitation} /></figcaption>
		{/if}
		{#if images}
		<figure class="image-container">
			<div class="image-list">
				{#each images as {id, filename, thumbnails, type, url}}
				<div class="image-wrapper">
					<img src="{url}" alt="{filename}" />
				</div>
				{/each}
			</div>
			{#if imageCaption}
			<figcaption class="caption">
				{@html markdown.render(imageCaption)}
			</figcaption>
			{/if}
		</figure>
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
			{#each childTitles as child}
			&ZeroWidthSpace;<li>&ZeroWidthSpace;<a class="child" href="/{entity}/{entitySlug}/{slug}/{slugify(child)}">&ZeroWidthSpace;{child}&ZeroWidthSpace;</a>&ZeroWidthSpace;</li>&ZeroWidthSpace;
			{/each}
		</ol>
		{/if}
		{#if connectionTitles}
		<ol class="linked-list extract-connections">
			{#each connectionTitles as child}
			&ZeroWidthSpace;<li>&ZeroWidthSpace;<a class="child" href="/{entity}/{entitySlug}/{slugify(child)}">&ZeroWidthSpace;{child}&ZeroWidthSpace;</a>&ZeroWidthSpace;</li>&ZeroWidthSpace;
			{/each}
		</ol>
		{/if}
		{#if topics}
		<ul class="extract-spaces">
			{#each topics as topic}
			<li><a class="topic" href="/spaces/{topic}">{topic}</a></li>
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
	article {
		max-width: var(--reading-width-wide);
	}

	.extract-title > a {
		font-family: inherit;
		color: var(--text-primary);
		font-size: inherit;
		line-height: inherit;
	}

	.extract-main {
		display: flex;
		flex-direction: column;
	}

	.image-container > .image-list {
			display: flex;
			flex-direction: column;
			/* margin: 0 calc(-1 * var(--container-padding-side)); */
		}

	img {
		border: 1px solid var(--clr-darker-10);
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

	.extract-spaces {
		list-style-type: none;
		margin-bottom: 0;
		display: flex;
		max-width: 100%;
		overflow-x: auto;
	}

	.extract-spaces > li + li {
		margin-left: 1em;
	}

	.topic {
		color: var(--text-secondary);
		text-transform: uppercase;
		white-space: nowrap;
	}

	.topic::before {
		content: '#';
		opacity: 0.5;
		display: inline-block;
		margin-right: 2px;
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

	.linked-list li, .linked-list a {
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

	footer {
		border-top: 1px solid var(--divider);
		padding-top: 1rem;
		margin-top: 1rem;
	}
</style>

