<script lang="ts">
	import type { Attachment, Thumbnail } from 'airtable';

	interface AirtableImageProps {
		image: Attachment;
	}

	let { image }: AirtableImageProps = $props();
	let availableWidth = $state(0);

	const defaultThumbnail: Thumbnail = {
		url: image.url,
		width: 200,
		height: 100
	};

	let thumbnailLarge = $derived(image.thumbnails?.large);
	let thumbnailSmall = $derived(image.thumbnails?.small);
	let thumbnailFull = $derived(image.thumbnails?.full);

	const getThumbnail = () => {
		if (thumbnailSmall && thumbnailSmall.width > availableWidth) return thumbnailSmall;
		if (thumbnailLarge && thumbnailLarge.width > availableWidth) return thumbnailLarge;
		return thumbnailFull || defaultThumbnail;
	};

	let thumbnail = $derived(getThumbnail());
</script>

<div
	class="image-container"
	style={`--aspect-ratio: ${thumbnail.width} / ${thumbnail.height}`}
	bind:clientWidth={availableWidth}
>
	<img alt={image.filename} src={thumbnail.url} loading="lazy" />
</div>

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
