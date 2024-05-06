<script lang="ts">
	import ExtractGallery from '$components/ExtractGallery.svelte';

	let { data } = $props();

	let creators = $derived(data.selectedCreatorsData);
	let extracts = $derived(data.extractsByCreators);
</script>

<h1>
	{#each creators as creator (creator.id)}
		{creator.name}
	{/each}
</h1>
<ExtractGallery {extracts} />

<style lang="scss">
	h1 {
		margin-block-end: 0.5em;
	}
</style>
