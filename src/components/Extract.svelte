<script>
	import markdown from '../helpers/markdown';
	import get from 'lodash/get';
	import Link from './Link.svelte';
	import Book from './icons/Book.svelte';

	export let extract = {};

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

	$: images = get(extract, 'extract_image');
	$: imageCaption = get(extract, 'image_caption');
</script>

{#if extract}
<article>
	<header>
		<slot name="header">
			{#if title}
			<h1>
				<Link href="/commonplace"><Book /></Link>
				{title}
			</h1>
			{/if}
		</slot>
	</header>
	<figure>
		<slot name="image">
			{#if images}
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
			{/if}
		</slot>
	</figure>
	<blockquote>
		<slot>
			{@html markdown.render(text)}
			<cite class="text-mono">
				{#each creators as {id, name}}
				<Link href="{`/commonplace/creators/${id}`}">{name}</Link>{/each},
				<Link href="{`/commonplace/groups/${groupId}`}">{groupName}</Link>
			</cite>
		</slot>
	</blockquote>
	<aside>
		<slot name="aside">
			{#if notes} {@html markdown.render(notes)} {/if}
		</slot>
	</aside>
	<footer>
		<slot name="footer">
			Recorded on {extractedOn}
		</slot>
	</footer>
</article>
{:else}
<code>Loading extract content.</code>
{/if}

<style>
	header:empty,
	aside:empty,
	footer:empty {
		display: none;
	}

	article {
		max-width: 50rem;
	}
	figure {
		margin: 0;
	}
	.images {
		display: flex;
	}
	figure img {
		max-width: 100%;
	}
	blockquote {
		border-bottom: 1px solid var(--divider);
		padding-bottom: 1rem;
		margin: 0 0 1rem 0;
	}
	blockquote :global(blockquote) {
		margin: 0;
		font-style: italic;
		font-size: 1.2em;
		font-family: var(--font-stack-serif);
	}
	cite {
		font-style: normal;
		display: block;
		margin-top: 1rem;
	}
	footer,
	aside,
	figcaption {
		font-size: 0.85em;
		color: var(--text-secondary);
	}
	footer {
		font-style: italic;
	}
</style>

