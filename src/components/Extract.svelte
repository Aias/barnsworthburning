<script>
	import markdown from '../helpers/markdown';
	import slugify from '../helpers/slugify';
	import get from 'lodash/get';
	import Link from './Link.svelte';
	import CreatorNames from './CreatorNames.svelte';

	export let extract = {};
	export let isCompact = false;
	export let listed = false;

	$: showFooter = !isCompact && !listed;

	$: title = get(extract, 'title');
	$: slug = title ? slugify(title) : '';
	$: text = get(extract, 'extract_text', '');
	$: notes = get(extract, 'notes');
	$: extractedOn = new Date(get(extract, 'extracted_on'));

	$: creatorIds = get(extract, 'creator', []);
	$: creatorNames = get(extract, 'creator_name', []);

	$: workSlug = get(extract, 'group_slug[0]');
	$: workName = get(extract, 'group_name[0]');

	$: isMe = (creatorIds.findIndex(c => c === 'recZ4n0P0GpAG28UO') > -1) || (workSlug === 'barnsworthburningnet');

	$: images = get(extract, 'extract_image');
	$: imageCaption = get(extract, 'image_caption');

	const stopPropagation = (e) => e.stopPropagation();
</script>

{#if extract}
<article class:myself={isMe} class:compact={isCompact} class:listed={listed} id={slug}>
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
			{@html markdown.render(text)}
			{#if !isMe && !listed}
			<cite class="text-mono">
				<CreatorNames creatorNames="{creatorNames}" />, <Link href="{`/works/${workSlug}`}" on:click={stopPropagation}>{workName}</Link>
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
			max-width: 100%;
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

		.myself cite {
			display: none; /* That would just be tacky. */
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

