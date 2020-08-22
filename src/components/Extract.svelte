<script>
	import markdown from '../helpers/markdown';
	import slugify from '../helpers/slugify';
	import get from '../helpers/get'
	import Link from './Link.svelte';
	import CreatorNames from './CreatorNames.svelte';

	export let extract = {};

	const isWork = get(extract, 'is_work')

	const title = get(extract, 'title');
	const slug = get(extract, 'full_slug', slugify(title));
	const text = get(extract, 'extract', '');
	const notes = get(extract, 'notes');
	const extractedOn = new Date(get(extract, 'extracted_on'));

	const creatorSlugs = get(extract, 'combined_creator_slugs', []);
	const creatorNames = get(extract, 'combined_creator_names', []);

	const parentSlug = get(extract, 'parent_slug[0]');
	const parentName = get(extract, 'parent_name[0]');

	const images = get(extract, 'extract_image');
	const imageCaption = get(extract, 'image_caption');
</script>

<article class="extract {isWork ? 'extract--work' : 'extract--fragment'}" id={slug}>
	{#if title}
	<header>
		<h2>{title}</h2>
	</header>
	{/if}
	<figure class="extract-main">
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
		{#if text || (creatorNames.length > 0 || parentName)}
		<blockquote class="extract-text markdown-block" cite={extract.source}>
			{#if text}
			{@html markdown.render(text)}
			{/if}
		</blockquote>
		{/if}
		<figcaption class="extract-source text-mono">
			{#if creatorNames.length > 0}
			<CreatorNames creatorNames="{creatorNames}" />
			{/if}
			{#if parentName}
			<Link className="parent" href="{`/works/${parentSlug}`}"><cite>{parentName}</cite></Link>
			{/if}			
		</figcaption>
	</figure>
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

	.extract-source > :global(*:not(:last-child)::after) {
		content: ", ";
	}

	cite {
		font-style: normal;
	}

	footer {
		border-top: 1px solid var(--divider);
		padding-top: 1rem;
		margin-top: 1rem;
	}
</style>

