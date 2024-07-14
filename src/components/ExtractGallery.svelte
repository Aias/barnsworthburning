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
		<div class="extract-wrapper">
			<Extract {extract} variant="card" />
		</div>
	{/each}
</div>

<style lang="scss">
	.gallery {
		column-width: 40ch;
		column-gap: 1em;
	}
	.extract-wrapper {
		break-inside: avoid;
		padding-block-end: 1em;
		&:last-of-type {
			padding-block-end: 0;
		}
	}
	// @supports (grid-template-rows: masonry) {
	// 	.gallery {
	// 		all: initial;
	// 		display: grid;
	// 		grid-template-columns: repeat(auto-fill, minmax(40ch, 1fr));
	// 		grid-template-rows: masonry;
	// 		gap: 1em;

	// 		> :global(*) {
	// 			margin-block: 0;
	// 		}
	// 	}
	// }
</style>
