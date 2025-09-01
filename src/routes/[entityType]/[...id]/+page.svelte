<script lang="ts">
	import CreatorItem from '../../app/CreatorItem.svelte';
	import CreatorSEO from '../../app/CreatorSEO.svelte';
	import SpaceItem from '../../app/SpaceItem.svelte';
	import SpaceSEO from '../../app/SpaceSEO.svelte';
	import ExtractItem from '../../app/ExtractItem.svelte';
	import ExtractSEO from '../../app/ExtractSEO.svelte';

	let { data } = $props();

	let { creator, space, extract, extracts = [], selectedId } = $derived(data);

	// For extract pages, combine the main extract with related extracts
	let allExtracts = $derived(
		extract && !extracts.some((e) => e.id === extract.id) ? [extract, ...extracts] : extracts
	);
</script>

{#if creator}
	<CreatorItem {creator} {extracts} />
	<CreatorSEO {creator} {extracts} />
{:else if space}
	<SpaceItem {space} {extracts} />
	<SpaceSEO {space} {extracts} />
{:else}
	<ExtractItem extracts={allExtracts} {selectedId} />
	<ExtractSEO extract={extract ?? allExtracts.find((e) => e.id === selectedId) ?? allExtracts[0]} />
{/if}
