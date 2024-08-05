<script lang="ts">
	import ExtractGallery from '$components/ExtractGallery.svelte';
	import type { IExtract } from '$types/Airtable';

	interface EntityLayoutProps {
		title: string;
		extracts?: IExtract[];
	}
	let { title, extracts }: EntityLayoutProps = $props();
</script>

<h1>{title}</h1>
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
