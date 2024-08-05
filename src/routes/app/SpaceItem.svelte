<script lang="ts">
	import EntityLayout from './EntityLayout.svelte';
	import { capitalize } from '$helpers/grammar';
	import type { ISpace, IExtract } from '$types/Airtable';

	interface SpaceItemProps {
		space: ISpace;
		extracts?: IExtract[];
	}
	let { space, extracts }: SpaceItemProps = $props();

	let title = $derived(capitalize(space.title || space.topic || 'Unknown Space'));
	let description = $derived(`Explore the ${title} space on barnsworthburning`);
</script>

<svelte:head>
	<title>{title} | barnsworthburning</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={`https://barnsworthburning.net/space/${space.id}`} />
	{#if space.image}
		<meta property="og:image" content={space.image[0].url} />
	{/if}
	{#if space.creators && space.creators.length > 0}
		<meta name="author" content={space.creators.map((creator) => creator.name).join(', ')} />
	{/if}
</svelte:head>

<EntityLayout {title} {extracts} />
