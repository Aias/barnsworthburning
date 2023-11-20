<script>
	import { article } from '$helpers/grammar';
	import zip from '$helpers/zip';
	import CreatorList from './CreatorList.svelte';

	let { extract = {} } = $props();

	let {
		creators: creatorIds = [],
		creatorNames = [],
		parentCreators: parentCreatorIds = [],
		parentCreatorNames = [],
		parent: parentIds = [],
		parentTitle: parentTitles = [],
		type = 'Work',
		source,
		isWork
	} = $derived(extract);

	let creators = $state([]),
		parentCreators = $state([]);

	$effect.pre(() => {
		creators = zip(['id', 'name'], creatorIds, creatorNames);
		parentCreators = zip(['id', 'name'], parentCreatorIds, parentCreatorNames);
	});
	let parentTitle = $derived(parentTitles && parentTitles[0]);
</script>

<div class="citation">
	<div class="text-mono">
		<span class="article">{article(type)}</span>
		<span class="type">{type}</span>
		{#if parentIds.length > 0}
			<span class="parent">from <a href="/{parentIds[0]}"><cite>{parentTitle}</cite></a></span>
		{/if}
		<span class="creators">by <CreatorList creators={creators.length > 0 ? creators : parentCreators} /></span>
	</div>
	{#if source}
		<div class="source small unthemey">
			<a href={source} target="_blank" rel="noreferrer">{new URL(source).hostname}</a>
		</div>
	{/if}
</div>

<style lang="scss">
	.citation {
		display: contents;
		color: var(--secondary);
	}

	.type {
		text-transform: lowercase;
	}

	cite {
		font-style: italic;
	}
</style>
