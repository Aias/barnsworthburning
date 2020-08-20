<script>
	import markdown from '../helpers/markdown';
	import slugify from '../helpers/slugify';
	import get from '../helpers/get'
	import Link from './Link.svelte';
	import CreatorNames from './CreatorNames.svelte';

	export let extract = {};
	export let isCompact = false;
	export let suppressCitation = false;

	$: showFooter = false;

	const isWork = get(extract, 'is_work')

	const title = get(extract, 'title');
	const slug = title ? slugify(title) : '';
	const text = get(extract, 'extract', '');
	const notes = get(extract, 'notes');
	const extractedOn = new Date(get(extract, 'extracted_on'));

	const creatorSlugs = get(extract, 'combined_creator_slugs', []);
	const creatorNames = get(extract, 'combined_creator_names', []);

	const parentSlug = get(extract, 'parent_slug[0]');
	const parentName = get(extract, 'parent_name[0]');

	const images = get(extract, 'extract_image');
	const imageCaption = get(extract, 'image_caption');

	const stopPropagation = (e) => e.stopPropagation();
</script>

{#if extract}
<article class="extract" class:compact={isCompact} class:no-cite={suppressCitation} id={slug}>
	{#if title}
	<header>
		<h2>{title}</h2>
	</header>
	{/if}
	{#if images}
	<figure>
		<div class="images">
			{#each images as {id, filename, thumbnails, type, url}}
			<div class="image-wrapper">
				<img src="{url}" alt="{filename}" />
			</div>
			{/each}
		</div>
		{#if imageCaption}
		<figcaption>
			{@html markdown.render(imageCaption)}
		</figcaption>
		{/if}
	</figure>
	{/if}
	<blockquote class="extract-main markdown-block">
		<slot>
			{#if text}
			{@html markdown.render(text)}
			{/if}
			{#if !suppressCitation}
			<cite class="text-mono">
				{#if creatorNames.length > 0}
				<CreatorNames creatorNames="{creatorNames}" />
				{/if}
				{#if parentName}
				<Link className="parent" href="{`/works/${parentSlug}`}" on:click={stopPropagation}>{parentName}</Link>
				{/if}
			</cite>
			{/if}
		</slot>
	</blockquote>
	{#if notes}
	<aside class="markdown-block">
		{@html markdown.render(notes)}
	</aside>
	{/if}
	{#if showFooter}
	<footer>
		Recorded on {extractedOn}
	</footer>
	{/if}
</article>
{/if}

<style>
	article {
		max-width: var(--reading-width-wide);
	}


	figure > .images {
			display: flex;
			flex-direction: column;
		}

	img {
		border: 1px solid var(--clr-darker-10);
	}

	.extract-main {
		padding: 0;
		border: none;
		font-style: inherit;
		font-size: inherit;
		font-family: inherit;
	}

	aside > :global(* + *) {
		margin-top: 1em;
	}

	.extract-main + * {
		border-top: 1px solid var(--divider);
		padding-top: 1rem;
		margin-top: 1rem;
	}

	cite {
		font-style: normal;
		display: block;
		margin-top: 1rem;
	}

	cite > :global(*:not(:last-child)::after) {
		content: ", ";
	}

	footer,
	aside,
	figcaption {
		font-size: var(--font-size-0);
		color: var(--text-secondary);
	}

	footer {
		margin-top: 1rem;
		font-style: italic;
	}
</style>

