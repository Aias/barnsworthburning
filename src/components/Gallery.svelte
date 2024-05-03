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
		<Extract {extract} contextId="gallery" class="card" />
	{/each}
</div>

<style lang="scss">
	.gallery {
		--gallery-gap: 1em;

		padding-inline: calc(var(--padding) / 1.5);
		margin-inline: calc(-1 * var(--padding) / 1.5);

		column-width: 35ch;
		column-gap: var(--gallery-gap);

		> :global(*) {
			margin-block-end: var(--gallery-gap);
		}
	}
</style>
