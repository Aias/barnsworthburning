<script>
	import slugify from '../helpers/slugify';
	import get from '../helpers/get'
	import { article } from '../helpers/isFirstLetterAVowel';
	import domainOfUrl from '../helpers/domainOfUrl';
	import CreatorNames from './CreatorNames.svelte';
	import InternalLink from './InternalLink.svelte';
	import { getContext } from 'svelte';

	const parentContainer = getContext('parentContainer');

	export let extract = {};
	export let suppressCitation = false;

	const combinedCreatorNames = get(extract, 'combined_creator_names', []);
	const parentCreatorNames = get(extract, 'parent_creator_names', []);
	const slug = get(extract, 'slug');
	const parentTitle = get(extract, 'parent_title[0]');
	const parentSlug = get(extract, 'parent_slug[0]');
	const type = get(extract, 'type', 'Work');
	const source = get(extract, 'source');
	const isWork = get(extract, 'is_work');

	$: creatorNames = suppressCitation ? combinedCreatorNames.filter(name => parentCreatorNames.indexOf(name) === -1) : combinedCreatorNames;
	$: showCitation = isWork ? true : suppressCitation ? creatorNames.length > 0 : true;
</script>

{#if showCitation}
	<div class="{isWork ? 'work' : 'extract'} text-mono">
	{#if isWork}
		<span>
			{article(type)}&nbsp;<span class="extract-type">{type}</span>
			{#if parentTitle && !suppressCitation}
			from <InternalLink class="parent" toExtract="{parentSlug}" toFragment="{parentContainer === 'panel' ? slug : undefined}"><cite>{parentTitle}</cite></InternalLink>
			{/if}
			{#if creatorNames.length > 0}
			by <CreatorNames creatorNames="{creatorNames}" />
			{/if}		
		</span>
	{:else}
		{#if creatorNames.length > 0}
		<CreatorNames class="creator-names" creatorNames="{creatorNames}" />{#if parentTitle && !suppressCitation}<span>, </span>{/if}
		{/if}
		{#if parentTitle && !suppressCitation}
		<InternalLink class="parent" toExtract="{parentSlug}" toFragment="{parentContainer === 'panel' ? slug : undefined}"><cite>{parentTitle}</cite></InternalLink>
		{/if}	
	{/if}
	{#if source}
		<div class="small extract-source">
			<a href="{source}" target="_blank" rel="noreferrer">{domainOfUrl(source)}</a>
		</div>
	{/if}
	</div>
{/if}

<style>
	.extract-type {
		text-transform: lowercase;
	}

	cite {
		font-style: italic;
	}

	.extract-source {
		display: inline;
		--opacity: 0.8;
		opacity: var(--opacity);
		transition: opacity 0.25s;
		margin-left: 0.25em;
	}

	.extract-source:hover {
		opacity: 1;
	}

	.extract-source:before {
		opacity: var(--opacity);
		content: '[';
	}
	.extract-source:after {
		opacity: var(--opacity);
		content: ']';
	}
</style>