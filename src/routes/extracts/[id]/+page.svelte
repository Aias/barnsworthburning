<script lang="ts">
	import cache from '$lib/cache.svelte';
	import { page } from '$app/stores';
	import ExtractItem from '../../app/ExtractItem.svelte';

	let { data } = $props();

	$effect.pre(() => {
		cache.addExtracts(data.selectedExtractData);
	});

	let extractId = $derived($page.params.id);
	let selected = $derived(cache.extractsById.get(extractId));
</script>

<svelte:head>
	{#if selected?.title}
		<title>{selected.title}</title>
	{/if}
</svelte:head>
<ExtractItem {extractId} />
