<script lang="ts">
	import LooseleafCard from '$components/LooseleafCard.svelte';
	import type { IExtract } from '$types/Airtable';

	interface LooseleafProps {
		extracts: IExtract[];
	}

	let { extracts } = $props<LooseleafProps>();
</script>

<div class="looseleaf">
	{#each extracts as extract (extract.id)}
		<LooseleafCard {extract} />
	{/each}
</div>

<style lang="scss">
	.looseleaf {
		--gallery-gap: 0.25em;
		column-width: 15em;
		column-gap: var(--gallery-gap);

		> :global(*) {
			margin-bottom: var(--gallery-gap);
			break-inside: avoid;
		}
	}
</style>
