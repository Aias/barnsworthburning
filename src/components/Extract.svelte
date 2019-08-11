<script>
	import markdown from '../helpers/markdown';
	import get from 'lodash/get';
	import Link from './Link.svelte';
	import Book from './icons/Book.svelte';
	import Loading from './Loading.svelte';

	export let extract = {};
	export let showFooter = true;

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

	$: groupId = get(extract, 'group[0]');
	$: groupName = get(extract, 'group_name[0]');

	$: isMe = (creatorIds.findIndex(c => c === 'recZ4n0P0GpAG28UO') > -1) || (groupId === 'recusqwqKOFFfyopC');

	$: images = get(extract, 'extract_image');
	$: imageCaption = get(extract, 'image_caption');
</script>

{#if extract}
<article class:myself={isMe}>
	{#if title}
	<header>
		<h1>
			<Link href="/commonplace"><Book /></Link>
			{title}
		</h1>
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
	<blockquote class="markdown-block">
		<slot>
			{@html markdown.render(text)}
			{#if !isMe}
			<cite class="text-mono">
				{#each creators as {id, name}, i}{i > 0 ? i + 1 === creators.length ? ' & ' : ', ': ''}<Link className="creator" href="{`/commonplace/creators/${id}`}">{name}</Link>{/each}, <Link href="{`/commonplace/groups/${groupId}`}">{groupName}</Link>
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
{:else}
<Loading />
{/if}

<style>
	article {
		max-width: 50rem;
	}

	figure {
		margin: 0;
	}

		.images {
			display: flex;
		}

		img {
			max-width: 100%;
		}

	blockquote {
		margin: 1rem 0 0 0;
	}

		blockquote + * {
			border-top: 1px solid var(--divider);
			padding-top: 1rem;
			margin-top: 1rem;
		}

		blockquote :global(blockquote) {
			margin: 0;
			font-style: italic;
			font-size: var(--font-size-20);
			font-family: var(--font-stack-serif);
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

