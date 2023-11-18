<script>
	import markdown from '$helpers/markdown';
	import slugify from '$helpers/slugify';

	let { extract, idPrefix = 'extract' } = $props();

	let { 
		is_work: isWork, 
		title, 
		slug, 
		extract: text, 
		notes, 
		space_topics: topics, 
		child_titles: childTitles, 
		connection_titles: connectionTitles, 
		extract_image: images, 
		image_caption: imageCaption
	} = extract;

	slug = slug || slugify(title);
	text = text || '';

	const elementId = idPrefix ? `${idPrefix}--${slug}` : slug;

	const maxChildren = 5;
	let showAllChildren = $state(false);
	let truncatedChildren = $derived(!showAllChildren && (childTitles && childTitles.length > maxChildren));
</script>

<article id={elementId} class="extract {isWork ? 'extract--work' : 'extract--fragment'}">
	{#if title}
	<header>
		<h2 class="extract-title">{title}</h2>
	</header>
	{/if}
	<figure class="extract-main">
		{#if images}
		<img alt="yes" />
		{/if}
		{#if text}
		<blockquote class="extract-text markdown-block" cite={extract.source}>
			{@html markdown.render(text)}
		</blockquote>
		{/if}
		<figcaption class="extract-caption">A person</figcaption>
	</figure>
	{#if childTitles || connectionTitles || topics}
	<section class="relations">
		{#if childTitles}
		<ol class="children">
			{#each childTitles as child, i}
			{#if truncatedChildren && i > maxChildren}
			<!-- Don't render anything. -->
			{:else if truncatedChildren && i === maxChildren}
			<li><button on:click="{() => showAllChildren = true}" class="link caption">+{childTitles.length - maxChildren} More</button></li>
			{:else}
			<li>{child}</li>
			{/if}
			{/each}
		</ol>
		{/if}
		{#if connectionTitles}
		<ol class="connections">
			{#each connectionTitles as connection}
			<li>{connection}</li>
			{/each}
		</ol>
		{/if}
		{#if topics}
		<ul class="spaces">
			{#each topics as topic}
			<li>{topic}</li>
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

<style lang="scss">
	.extract-main {
		display: flex;
		flex-direction: column;
	}

	.extract--work .extract-caption {
		order: -1;
	}

	.extract-caption:empty {
		display: none;
	}

	.extract-text {
		padding: 0;
		border: none;
		font-style: inherit;
		font-size: inherit;
		font-family: inherit;
	}

	.relations {
		> * {
			--spacing: 0.5em;
			font-size: var(--font-size-small);
		}
		.children, .connections {
			padding-left: 20px;

			&::before {
				position: absolute;
				left: 0;
			}			
		}
		.children::before {
			content: '↳';
		}

		.connections::before {
			content: '⮂';
		}
	}

	.spaces {
		--spacing: 1em;
		list-style-type: none;
		margin-bottom: 0;
		margin-left: calc(-1 * var(--spacing));
		display: flex;
		flex-wrap: wrap;
		max-width: 100%;

		> li {
			margin-left: var(--spacing);
		}
	}

	footer {
		border-top: 1px solid var(--divider);
		padding-top: 1rem;
		margin-top: 1rem;
	}
</style>

