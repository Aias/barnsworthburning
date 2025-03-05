<script lang="ts">
	import { page } from '$app/state';
	import CreatorItem from '../../app/CreatorItem.svelte';
	import CreatorSEO from '../../app/CreatorSEO.svelte';
	import SpaceItem from '../../app/SpaceItem.svelte';
	import SpaceSEO from '../../app/SpaceSEO.svelte';
	import ExtractItem from '../../app/ExtractItem.svelte';
	import ExtractSEO from '../../app/ExtractSEO.svelte';

	let { data } = $props();

	let { creator, space, extracts = [] } = $derived(data);
	let { id } = $derived(page.params);
</script>

{#if creator}
	<CreatorItem {creator} {extracts} />
	<CreatorSEO {creator} {extracts} />
{:else if space}
	<SpaceItem {space} {extracts} />
	<SpaceSEO {space} {extracts} />
{:else}
	<ExtractItem {extracts} selectedId={id} />
	<ExtractSEO extract={extracts.find((e) => e.id === id) ?? extracts[0]} />
{/if}
