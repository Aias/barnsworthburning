<script lang="ts">
	import ExtractGallery from '$components/ExtractGallery.svelte';

	let { data } = $props();

	let creator = $derived(data.creator);
	let extracts = $derived(data.extractsByCreator);

	let title = $derived.by(() => {
		const { name } = creator;
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
