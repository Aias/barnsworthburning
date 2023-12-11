<script>
	import markdown from '$helpers/markdown';

	import Link from './Link.svelte';
	import Citation from './Citation.svelte';
	import TopicList from './TopicList.svelte';
	import RelationList from './RelationList.svelte';
	import AirtableImage from './AirtableImage.svelte';

	export let extract = undefined;
	export let contextId = 'panel';
	export let componentClass = undefined;

	$: id = extract?.id;
	$: title = extract?.title;
	$: extractContent = extract?.extract;
	$: notes = extract?.notes;
	$: images = extract?.images;
	$: imageCaption = extract?.imageCaption;

	$: children = extract?.children;
	$: connections = extract?.connections;
	$: spaces = extract?.spaces;

	$: hasRelations = children || connections || spaces;
	$: nodeId = contextId ? `${contextId}--${id}` : id;

	let mouseDownTime;
	let mouseUpTime;

	let containerRef;
	let linkRef;

	const handleMouseDown = () => {
		mouseDownTime = Date.now();
	};
	const handleMouseUp = () => {
		mouseUpTime = Date.now();
		if (mouseUpTime - mouseDownTime < 200) {
			linkRef.click();
		}
	};
</script>

<section
	role="link"
	tabindex="0"
	id={nodeId}
	class:extract={true}
	class:interactive={true}
	class={componentClass}
	bind:this={containerRef}
	on:mousedown={handleMouseDown}
	on:mouseup={handleMouseUp}
>
	{#if title}
		<header>
			<h2 class="extract-title"><Link bind:ref={linkRef} toExtract={id}>{title}</Link></h2>
		</header>
	{/if}
	<figure class="extract-main">
		{#if images}
			<AirtableImage image={images[0]} />
			{#if imageCaption}
				<div class="extract-image-caption caption content">
					{@html markdown.render(imageCaption)}
				</div>
			{/if}
		{/if}
		{#if extractContent}
			<blockquote class="extract-text content" cite={extract.source}>
				{@html markdown.render(extractContent)}
			</blockquote>
		{/if}
		<figcaption class="extract-caption">
			<Citation {extract} />
		</figcaption>
	</figure>
	{#if hasRelations}
		<nav class="relations">
			<RelationList items={children} symbol="↳" label="Children" />
			<RelationList items={connections} symbol="⮂" label="Connections" />
			<TopicList topics={spaces} />
		</nav>
	{/if}
	{#if notes}
		<footer class="caption content">
			{@html markdown.render(notes)}
		</footer>
	{/if}
</section>

<style lang="scss">
	.extract {
		--layout-gap: 1em;
		display: flex;
		flex-direction: column;
		gap: var(--layout-gap);
		position: relative;
		isolation: isolate;
	}

	.extract-title {
		> :global(a) {
			all: inherit;
			display: inline-block;
			&:hover {
				text-decoration: underline;
			}
		}
	}

	.extract-main {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		color: var(--display);
	}

	.extract-image {
		border: 1px solid var(--divider);
	}

	.extract-caption {
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
