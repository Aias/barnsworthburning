<script lang="ts">
	import EntityLayout from './EntityLayout.svelte';
	import type { ICreator, IExtract } from '$types/Airtable';
	import { findFirstImageUrl } from '$helpers/images';

	interface CreatorItemProps {
		creator: ICreator;
		extracts?: IExtract[];
	}
	let { creator, extracts }: CreatorItemProps = $props();

	let creatorName = $derived(creator.name || 'Anonymous');
	let description = $derived(`Curated works by ${creatorName}.`);

	let firstImageUrl = $derived(findFirstImageUrl(extracts));
</script>

<svelte:head>
	<title>{creatorName}</title>
	<meta property="og:title" content={creatorName} />
	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content="barnsworthburning" />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={`https://barnsworthburning.net/creators/${creator.id}`} />
	<meta property="og:article:author" content={creatorName} />
	{#if firstImageUrl}
		<meta property="og:image" content={firstImageUrl} />
	{/if}
	<meta
		property="og:article:published_time"
		content={new Date(creator.createdTime).toISOString()}
	/>
	<meta
		property="og:article:modified_time"
		content={new Date(creator.lastUpdated).toISOString()}
	/>
</svelte:head>

<EntityLayout title={creatorName} {extracts} />
