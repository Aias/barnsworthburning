<script>
	import slugify from '../helpers/slugify';
	import get from '../helpers/get'
	import { article } from '../helpers/isFirstLetterAVowel';
	import domainOfUrl from '../helpers/domainOfUrl';
	import CreatorNames from './CreatorNames.svelte';
	import InternalLink from './InternalLink.svelte';

	export let extract = {};
	export let suppressCitation = false;

	const combinedCreatorNames = get(extract, 'combined_creator_names', []);
	const parentCreatorNames = get(extract, 'parent_creator_names', []);
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
			{article(type)} <span class="extract-type">{type}</span>
			{#if creatorNames.length > 0}
			by <CreatorNames creatorNames="{creatorNames}" />
			{/if}		
		</span>
	{:else}
		{#if creatorNames.length > 0}
		<CreatorNames class="creator-names" creatorNames="{creatorNames}" />
		{/if}
		{#if parentTitle && !suppressCitation}
		<span class="parent-name">
			<InternalLink class="parent" toExtract="{parentSlug}"><cite>{parentTitle}</cite></InternalLink>
		</span>
		{/if}	
	{/if}
	{#if source}
		<small class="extract-source">
			<a href="{source}" target="_blank">{domainOfUrl(source)}</a>
		</small>
	{/if}
	</div>
{/if}

<style>
	.extract-type {
		text-transform: lowercase;
	}

	:global(.creator-names:not(:last-of-type)::after ) {
		content: ', ';
	}

	cite {
		font-style: italic;
	}

	.extract-source {
		opacity: 0.5;
		transition: opacity 0.25s;
		margin-left: 0.25em;
	}

	.extract-source:hover {
		opacity: 1;
	}

	.extract-source:before {
		opacity: 0.5;
		content: '[';
	}
	.extract-source:after {
		opacity: 0.5;
		content: ']';
	}
</style>