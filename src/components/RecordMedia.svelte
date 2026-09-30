<script lang="ts">
	import type { PublicMedia } from '#lib/records.js';

	interface RecordMediaProps {
		media: PublicMedia;
	}

	let { media }: RecordMediaProps = $props();

	let aspectRatio = $derived(
		media.width && media.height ? `${media.width} / ${media.height}` : undefined
	);
</script>

<div class="media-container" style={aspectRatio ? `--aspect-ratio: ${aspectRatio}` : undefined}>
	{#if media.type === 'video'}
		<video
			src={media.url}
			aria-label={media.altText ?? undefined}
			autoplay
			controls
			muted
			loop
			playsinline
			preload="none"
		></video>
	{:else}
		<img alt={media.altText ?? ''} src={media.url} loading="lazy" />
	{/if}
</div>

<style>
	.media-container {
		inline-size: 100%;
		aspect-ratio: var(--aspect-ratio, auto);
		border: 1px solid var(--splash);
		overflow: hidden;

		img,
		video {
			inline-size: 100%;
			height: auto;
		}
	}
</style>
