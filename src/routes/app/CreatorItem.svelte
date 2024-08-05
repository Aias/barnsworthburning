<script lang="ts">
	import EntityLayout from './EntityLayout.svelte';
	import type { ICreator, IExtract } from '$types/Airtable';

	interface CreatorItemProps {
		creator: ICreator;
		extracts?: IExtract[];
	}
	let { creator, extracts }: CreatorItemProps = $props();

	let title = $derived(creator.name || 'Anonymous');
	let description = $derived(`Curated works by ${title} on barnsworthburning`);
</script>

<svelte:head>
	<title>{title} | barnsworthburning</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="profile" />
	<meta property="og:url" content={`https://barnsworthburning.net/creator/${creator.id}`} />
	{#if creator.image}
		<meta property="og:image" content={creator.image[0].url} />
	{/if}
	<meta property="profile:username" content={creator.name} />
</svelte:head>

<EntityLayout {title} {extracts} />
