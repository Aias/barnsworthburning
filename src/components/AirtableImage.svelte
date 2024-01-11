<script>
	export let image = {};

	$: thumbnailLarge = image?.thumbnails?.large;
	$: img = thumbnailLarge || image;
</script>

<div class="image-container" style={`--aspect-ratio: ${img.width} / ${img.height}`}>
	<img alt={image.filename} src={img.url} loading="lazy" />
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
