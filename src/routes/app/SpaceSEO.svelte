<script lang="ts">
	import { capitalize } from '$helpers/grammar';
	import type { ISpace, IExtract } from '$types/Airtable';
	import { findFirstImageUrl } from '$helpers/images';

	interface SpaceSEOProps {
		space: ISpace;
		extracts?: IExtract[];
	}
	let { space, extracts }: SpaceSEOProps = $props();

	let title = $derived(capitalize(space.title || space.topic || 'Untagged'));
	let description = $derived(`Curated extracts about ${title}.`);

	let firstImageUrl = $derived(findFirstImageUrl(extracts));
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title} />
	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content="barnsworthburning" />
	<meta property="og:url" content={`https://barnsworthburning.net/spaces/${space.id}`} />
	<meta property="og:type" content="article" />
	<meta property="article:section" content={title} />
	<meta property="article:tag" content={space.topic} />
	<meta
		property="og:article:published_time"
		content={new Date(space.createdTime).toISOString()}
	/>
	<meta property="og:article:modified_time" content={new Date(space.lastUpdated).toISOString()} />
	{#if firstImageUrl}
		<meta property="og:image" content={firstImageUrl} />
	{/if}
</svelte:head>
