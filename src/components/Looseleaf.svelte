<script>
	import LooseleafCard from '$components/LooseleafCard.svelte';
	let { extracts } = $props();
</script>

<div class="looseleaf">
	{#each extracts as extract (extract.id)}
		<LooseleafCard {extract} />
	{/each}
</div>

<style lang="scss">
	.looseleaf {
		--gallery-gap: 0.25em;
		font-size: 0.5em;
		column-width: 15em;
		column-gap: var(--gallery-gap);

		> :global(*) {
			margin-bottom: var(--gallery-gap);
			break-inside: avoid;
		}
	}
</style>
