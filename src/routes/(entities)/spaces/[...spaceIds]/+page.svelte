<script lang="ts">
	import ExtractGallery from '$components/ExtractGallery.svelte';

	let { data } = $props();

	let spaces = $derived(data.selectedSpacesData);
	let extracts = $derived(data.extractsInSpaces);
</script>

<h1>
	{#each spaces as space (space.id)}
		{space.topic}
	{/each}
</h1>
<ExtractGallery {extracts} density={extracts.length > 200 ? 'compact' : 'comfortable'} />

<style lang="scss">
	h1 {
		margin-block-end: 0.5em;
		text-transform: capitalize;
	}
</style>
