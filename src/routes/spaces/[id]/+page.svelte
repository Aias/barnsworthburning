<script lang="ts">
	import ExtractGallery from '$components/ExtractGallery.svelte';
	import { capitalize } from '$helpers/grammar.js';

	let { data } = $props();

	let space = $derived(data.space);
	let extracts = $derived(data.extractsInSpace);

	let title = $derived.by(() => {
		const { title, topic } = space;
		let str = capitalize(title || topic);
		// if (icon) str += ` ${icon}`;
		return str;
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
