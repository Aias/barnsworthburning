<script lang="ts">
	import ExtractGallery from '$components/ExtractGallery.svelte';
	import { capitalize } from '$helpers/grammar.js';

	let { data } = $props();

	let spaces = $derived(data.selectedSpacesData);
	let extracts = $derived(data.extractsInSpaces);

	let title = $derived.by(() => {
		const primarySpace = spaces[0];
		const { title, topic } = primarySpace;
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
		text-transform: capitalize;
	}
</style>
