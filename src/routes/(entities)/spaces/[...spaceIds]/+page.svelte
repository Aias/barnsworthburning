<script lang="ts">
	import Gallery from '$components/Gallery.svelte';
	import Looseleaf from '$components/Looseleaf.svelte';

	let { data } = $props();

	let spaces = $derived(data.selectedSpacesData);
	let extracts = $derived(data.extractsInSpaces);
</script>

<h1>
	{#each spaces as space (space.id)}
		{space.topic}
	{/each}
</h1>
{#if extracts.length < 20}
	<Gallery {extracts} />
{:else}
	<Looseleaf {extracts} />
{/if}

<style lang="scss">
	h1 {
		margin-block-end: 0.5em;
		text-transform: capitalize;
	}
</style>
