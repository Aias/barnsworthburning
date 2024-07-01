<script lang="ts">
	import ExtractGallery from '$components/ExtractGallery.svelte';

	let { data } = $props();

	let creators = $derived(data.selectedCreatorsData);
	let extracts = $derived(data.extractsByCreators);

	let title = $derived.by(() => {
		const primaryCreator = creators[0];
		const { name } = primaryCreator;
		return name;
	});
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>
<h1>
	{title}
</h1>
<ExtractGallery {extracts} />

<style lang="scss">
	h1 {
		margin-block-end: 0.5em;
	}
</style>
