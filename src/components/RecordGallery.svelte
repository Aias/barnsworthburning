<script lang="ts">
	import RecordCard from './RecordCard.svelte';
	import type { RecordCard as CardData } from '$lib/records';

	interface GalleryProps {
		records: CardData[];
	}

	let { records }: GalleryProps = $props();
</script>

<div class="gallery">
	{#each records as record (record.id)}
		<div class="extract-wrapper">
			<RecordCard {record} variant="card" />
		</div>
	{/each}
</div>

<style>
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
	@supports (grid-template-rows: masonry) {
		.gallery {
			all: initial;
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(40ch, 1fr));
			grid-template-rows: masonry;
			gap: 1em;

			& > :global(*) {
				margin-block: 0;
			}
		}
	}
</style>
