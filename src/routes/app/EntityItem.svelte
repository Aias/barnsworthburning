<script lang="ts">
	import ExtractGallery from '$components/ExtractGallery.svelte';
	import type { IExtract } from '$types/Airtable';

	interface EntityItemProps {
		title?: string;
		extracts?: IExtract[];
	}
	let { title = 'Unknown', extracts }: EntityItemProps = $props();
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<h1>
	{title}
</h1>
{#if extracts}
	<ExtractGallery {extracts} />
{:else}
	<em>No associated extracts.</em>
{/if}

<style>
	h1 {
		margin-block-end: 0.5em;
	}
</style>
