<script lang="ts">
	import type { MediaSelect } from '@aias/hozo';

	interface RecordImageProps {
		media: MediaSelect;
	}

	let { media }: RecordImageProps = $props();

	let aspectRatio = $derived(
		media.width && media.height ? `${media.width} / ${media.height}` : undefined
	);
</script>

<div class="image-container" style={aspectRatio ? `--aspect-ratio: ${aspectRatio}` : undefined}>
	<img alt={media.altText ?? ''} src={media.url} loading="lazy" />
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
