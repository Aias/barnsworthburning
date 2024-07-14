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
		<Extract {extract} variant="card" />
	{/each}
</div>

<style lang="scss">
	.gallery {
		column-width: 40ch;
		column-gap: 1em;
		line-height: 0;

		> :global(*) {
			// Line height and display/width vars here fix a weird safari bug
			// where the first item in a column has margin at the top
			line-height: var(--line-height-normal);
			display: inline-block;
			width: 100%;
			margin-block-end: 1em;
			margin-block-start: 0;
			break-inside: avoid;
			&:last-of-type {
				margin-block-end: 0;
			}
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
