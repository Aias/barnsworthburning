<script lang="ts">
	import type { Attachment } from 'airtable';

	// Define a props type
	interface AirtableImageProps {
		image: Attachment;
	}

	let { image } = $props<AirtableImageProps>();

	let thumbnail = $derived(image.thumbnails?.large);
</script>

{#if thumbnail}
	<div class="image-container" style={`--aspect-ratio: ${thumbnail.width} / ${thumbnail.height}`}>
		<img alt={image.filename} src={thumbnail.url} loading="lazy" />
	</div>
{:else}
	<div class="image-container">
		<img alt={image.filename} src={image.url} loading="lazy" />
	</div>
{/if}

<style lang="scss">
	.image-container {
		width: 100%;
		aspect-ratio: var(--aspect-ratio, 'auto');
		overflow: hidden;

		img {
			width: 100%;
			height: auto;
		}
	}
</style>
