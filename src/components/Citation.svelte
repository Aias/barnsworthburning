<script>
	import { article } from '$helpers/grammar';
	import CreatorList from './CreatorList.svelte';

	const { extract = {}, suppressCitation = false } = $props();

	const {
		combined_creator_names: creatorNames = [],
		parent_title: parentTitles = [],
		type = 'Work',
		source,
		is_work: isWork
	} = extract;

	const parentTitle = parentTitles && parentTitles[0];
</script>

{#if showCitation}
	<div class="{isWork ? 'work' : 'extract'} text-mono">
		{#if isWork}
			<span>
				{article(type)} <span class="extract-type">{type}</span>
				{#if parentTitle && !suppressCitation}
					from <cite>{parentTitle}</cite>
				{/if}
				{#if creatorNames.length > 0}
					by <CreatorList {creatorNames} />
				{/if}
			</span>
		{:else}
			{#if creatorNames.length > 0}
				<CreatorList {creatorNames} />{#if parentTitle && !suppressCitation}<span>, </span>{/if}
			{/if}
			{#if parentTitle && !suppressCitation}
				<cite>{parentTitle}</cite>
			{/if}
		{/if}
		{#if source}
			<div class="extract-source small">
				<a href={source} target="_blank" rel="noreferrer">{new URL(source).hostname}</a>
			</div>
		{/if}
	</div>
{/if}

<style lang="scss">
	.extract-type {
		text-transform: lowercase;
	}

	cite {
		font-style: italic;
	}

	.extract-source {
		display: inline;
		--opacity: 0.75;
		opacity: var(--opacity);
		transition: opacity 0.25s;
		margin-left: 0.25em;

		::before,
		::after {
			opacity: var(--opacity);
		}
		::before {
			content: '[';
		}
		::after {
			content: ']';
		}

		&:hover {
			opacity: 1;
		}
	}
</style>
