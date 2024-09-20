<script lang="ts">
	import type { Attachment, Thumbnail } from 'airtable';

	interface AirtableImageProps {
		image: Attachment & {
			width?: number; // Exists on API response, types are wrong here as of Airtable 0.12.2
			height?: number;
		};
	}

	let { image }: AirtableImageProps = $props();

	const DEFAULT_WIDTH = 100;
	let availableWidth = $state(DEFAULT_WIDTH);

	const defaultThumbnail: Thumbnail = $derived({
		url: image.url,
		width: image.width ?? DEFAULT_WIDTH,
		height: image.height ?? DEFAULT_WIDTH / 2 // Assume 2:1 aspect ratio
	});

	let thumbnailLarge = $derived(image.thumbnails?.large);
	let thumbnailSmall = $derived(image.thumbnails?.small);
	let thumbnailFull = $derived(image.thumbnails?.full);

	let thumbnail = $derived.by(() => {
		if (thumbnailSmall && thumbnailSmall.width > availableWidth) return thumbnailSmall;
		if (thumbnailLarge && thumbnailLarge.width > availableWidth) return thumbnailLarge;
		return thumbnailFull || defaultThumbnail;
	});
	let src = $derived(thumbnail.url);
</script>

<div
	class="image-container"
	style={`--aspect-ratio: ${thumbnail.width} / ${thumbnail.height}`}
	bind:clientWidth={availableWidth}
>
	<img alt={image.filename} {src} loading="lazy" />
</div>

<style>
	.image-container {
		inline-size: 100%;
		aspect-ratio: var(--aspect-ratio, 'auto');
		border: 1px solid var(--splash);
		overflow: hidden;

		img {
			inline-size: 100%;
			height: auto;
		}
	}
</style>
