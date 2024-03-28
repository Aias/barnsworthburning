<script lang="ts">
	import LooseleafCard from '$components/LooseleafCard.svelte';
	import type { IExtract } from '$types/Airtable';

	interface LooseleafProps {
		extracts: IExtract[];
		scale?: number;
	}

	let { extracts, scale }: LooseleafProps = $props();

	const scaleStyle = scale ? `--scale: ${scale}em` : undefined;
</script>

<div class="looseleaf" style={scaleStyle}>
	{#each extracts as extract (extract.id)}
		<LooseleafCard {extract} />
	{/each}
</div>

<style lang="scss">
	.looseleaf {
		--gallery-gap: 0.25em;
		font-size: var(--scale, 1em);
		column-width: 15em;
		column-gap: var(--gallery-gap);

		> :global(*) {
			margin-block-end: var(--gallery-gap);
			break-inside: avoid;
		}
	}
</style>
