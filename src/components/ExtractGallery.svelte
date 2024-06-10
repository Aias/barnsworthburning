<script lang="ts">
	import Extract from './Extract.svelte';
	import type { IExtract } from '$types/Airtable';

	interface GalleryProps {
		extracts: IExtract[];
	}

	let { extracts }: GalleryProps = $props();
</script>

<div class="gallery">
	{#each extracts as extract (extract.id)}
		<Extract {extract} contextId="gallery" class="card interactive" />
	{/each}
</div>

<style lang="scss">
	.gallery {
		column-width: 40ch;
		column-gap: 1em;

		> :global(*) {
			margin-block: 1em;
			break-inside: avoid;
			&:first-of-type {
				margin-block-start: 0;
			}
			&:last-of-type {
				margin-block-end: 0;
			}
		}
	}
</style>
