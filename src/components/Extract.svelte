<script>
	import markdown from '../helpers/markdown';
	import get from 'lodash/get';
	import Link from './Link.svelte';
	import Book from './icons/Book.svelte';
	import Loading from './Loading.svelte';

	export let extract = {};
	export let isCompact = false;
	export let listed = false;

	$: title = get(extract, 'title');
	$: text = get(extract, 'extract_text', '');
	$: notes = get(extract, 'notes');
	$: extractedOn = new Date(get(extract, 'extracted_on'));

	$: creatorIds = get(extract, 'creator', []);
	$: creatorNames = get(extract, 'creator_name', []);
	$: creators = creatorIds.map((id, i) => ({
		id,
		name: creatorNames[i]
	}));

	$: workId = get(extract, 'group[0]');
	$: workName = get(extract, 'group_name[0]');

	$: isMe = (creatorIds.findIndex(c => c === 'recZ4n0P0GpAG28UO') > -1) || (workId === 'recusqwqKOFFfyopC');

	$: images = get(extract, 'extract_image');
	$: imageCaption = get(extract, 'image_caption');
</script>

{#if extract}
<article class:myself={isMe} class:compact={isCompact} class:listed={listed}>
	{#if title}
	<header>
		{#if isCompact || listed}
			<h2>{title}</h2>
		{:else}
			<h1>
				<Link href="/extracts"><Book /></Link>
				{title}
			</h1>
		{/if}
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
			{imageCaption}
		</figcaption>
		{/if}
	</figure>
	{/if}
	<blockquote class="extract-main markdown-block">
		<slot>
			{@html markdown.render(text)}
			{#if !isMe && !listed}
			<cite class="text-mono">
				{#each creators as {id, name}, i}{i > 0 ? i + 1 === creators.length ? ' & ' : ', ': ''}<Link className="creator" href="{`/creators/${id}`}">{name}</Link>{/each}, <Link href="{`/works/${workId}`}">{workName}</Link>
			</cite>
			{/if}
		</slot>
	</blockquote>
	{#if notes}
	<aside class="markdown-block">
		{@html markdown.render(notes)}
	</aside>
	{/if}
	{#if !isCompact && !listed}
	<footer>
		Recorded on {extractedOn}
	</footer>
	{/if}
</article>
{:else}
<Loading />
{/if}

<style>
	article {
		max-width: 50rem;
	}

	figure {
		margin-left: 0;
		margin-right: 0;
	}

		.images {
			display: flex;
		}

		img {
			max-width: 100%;
		}

	.extract-main {
		padding: 0;
		border: none;
		margin: 1rem 0 0 0;
		font-style: inherit;
		font-size: inherit;
		font-family: inherit;
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

