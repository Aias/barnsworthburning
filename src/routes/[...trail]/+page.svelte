<script>
	import { page } from '$app/stores';
	import { decodeId } from '$helpers/params';
	import LooseleafCard from '$components/LooseleafCard.svelte';

	let trail = $derived($page.params.trail.split('/').map(decodeId));
	let data = $derived($page.data);

	let screens = $derived(trail.map((step) => data[step.id]));
</script>

{#each trail as step, i (step)}
	<section>
		<h2>{step.id} ({step.type})</h2>
		<div class="looseleaf">
			{#each screens[i] as extract (extract.id)}
				<LooseleafCard {extract} />
			{/each}
		</div>
	</section>
{/each}

<style lang="scss">
	section {
		flex: 0 0 540px;
		display: flex;
		flex-direction: column;
		gap: 1em;
	}
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
