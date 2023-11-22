<script>
	import { article } from '$helpers/grammar';
	import zip from '$helpers/zip';
	import CreatorList from './CreatorList.svelte';

	export let extract = {};

	$: creatorIds = extract.creators || [];
	$: creatorNames = extract.creatorNames || [];
	$: parentCreatorIds = extract.parentCreators || [];
	$: parentCreatorNames = extract.parentCreatorNames || [];
	$: parentIds = extract.parent || [];
	$: parentTitles = extract.parentTitle || [];
	$: type = extract.type || 'Work';
	$: source = extract.source;
	$: isWork = extract.isWork;

	$: creators = zip(['id', 'name'], creatorIds, creatorNames);
	$: parentCreators = zip(['id', 'name'], parentCreatorIds, parentCreatorNames);
	$: parentTitle = parentTitles && parentTitles[0];
</script>

<div class="citation">
	<div class="text-mono">
		<span class="article">{article(type)}</span>
		<strong class="type">{type}</strong>
		{#if parentIds.length > 0}
			<span class="parent">from <a href="/{parentIds[0]}"><cite>{parentTitle}</cite></a></span>
		{/if}
		<span class="creators">by <CreatorList creators={creators.length > 0 ? creators : parentCreators} /></span>
		{#if source}
			<div class="source">
				<a href={source} target="_blank" rel="noreferrer">{new URL(source).hostname}</a>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.citation {
		display: contents;
		color: var(--primary);
	}

	.type {
		text-transform: lowercase;
		color: var(--display);
	}

	cite {
		font-style: italic;
	}

	.source {
		display: inline-flex;
		white-space: nowrap;
		padding: 0 0.5em;
		background-color: var(--splash);
		border: 1px solid var(--divider);
		border-radius: 2px;
		font-size: 0.75em;
		line-height: inherit;

		a {
			color: var(--accent);
			text-decoration: none;
		}

		&:hover {
			background-color: var(--flood);
			cursor: pointer;
		}
	}
</style>
