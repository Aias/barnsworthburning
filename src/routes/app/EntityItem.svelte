<script lang="ts">
	import ExtractGallery from '$components/ExtractGallery.svelte';
	import type { IExtract } from '$types/Airtable';

	interface SpaceItemProps {
		title?: string;
		extracts?: IExtract[];
	}
	let { title = 'Unknown', extracts }: SpaceItemProps = $props();
</script>

<h1>
	{title}
</h1>
{#if extracts}
	<ExtractGallery {extracts} />
{:else}
	<em>No associated extracts.</em>
{/if}

<style lang="scss">
	h1 {
		margin-block-end: 0.5em;
	}
</style>
