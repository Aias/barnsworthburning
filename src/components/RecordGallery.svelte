<script lang="ts">
	import type { RecordCard as CardData } from '#lib/records.js';
	import RecordCard from './RecordCard.svelte';

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
	@supports (display: grid-lanes) {
		.gallery {
			display: grid-lanes;
			grid-template-columns: repeat(auto-fill, minmax(40ch, 1fr));
			gap: 1em;
		}
		.extract-wrapper {
			padding-block-end: 0;
		}
	}
</style>
