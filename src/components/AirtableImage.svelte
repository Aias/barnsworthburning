<script>
	const { image } = $props();

	image;

	$inspect(image);

	const thumbnailLarge = $derived(image?.thumbnails?.large);
	const img = $derived(thumbnailLarge || image);
	const aspectRatio = $derived((img.width / img.height) * 100);
</script>

<div class="image-container" style={`--aspect-ratio: ${aspectRatio}%`}>
	<img alt={image.filename} src={img.url} />
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
