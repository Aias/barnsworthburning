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
		<Extract {extract} contextId="gallery" class="card interactive" />
	{/each}
</div>

<style lang="scss">
	.gallery {
		--gallery-scale: var(--scale, 1em);

		font-size: var(--gallery-scale);

		column-width: 35ch;
		column-gap: var(--gallery-scale);

		> :global(*) {
			margin-block: var(--gallery-scale);
			break-inside: avoid;
			&:first-of-type {
				margin-block-start: 0;
			}
			&:last-of-type {
				margin-block-end: 0;
			}
		}
	}
</style>
