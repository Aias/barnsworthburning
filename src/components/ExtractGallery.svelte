<script lang="ts">
	import Extract from './Extract.svelte';
	import LooseleafCard from './LooseleafCard.svelte';
	import type { IExtract } from '$types/Airtable';

	interface GalleryProps {
		extracts: IExtract[];
		density?: 'comfortable' | 'compact';
		scale?: number;
	}

	let { extracts, density = 'comfortable', scale }: GalleryProps = $props();

	const scaleStyle = $derived.by(() => {
		if (density === 'comfortable') {
			return undefined;
		}
		return `--scale: ${scale ?? 0.65}em;`;
	});
</script>

<div class="gallery" class:compact={density === 'compact'} style={scaleStyle}>
	{#if density === 'compact'}
		{#each extracts as extract (extract.id)}
			<LooseleafCard {extract} />
		{/each}
	{:else}
		{#each extracts as extract (extract.id)}
			<Extract {extract} contextId="gallery" class="card" />
		{/each}
	{/if}
</div>

<style lang="scss">
	.gallery {
		--gallery-scale: var(--scale, 1em);

		font-size: var(--gallery-scale);
		padding-inline: calc(var(--gallery-scale) / 1.5);
		margin-inline: calc(-1 * var(--gallery-scale) / 1.5);

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
