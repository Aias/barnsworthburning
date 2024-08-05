<script lang="ts">
	import { page } from '$app/stores';
	import CreatorItem from '../../app/CreatorItem.svelte';
	import SpaceItem from '../../app/SpaceItem.svelte';
	import ExtractItem from '../../app/ExtractItem.svelte';

	let { data } = $props();

	let { creator, space, extracts = [] } = $derived(data);
	let { id } = $derived($page.params);
</script>

{#if creator}
	<CreatorItem {creator} {extracts} />
{:else if space}
	<SpaceItem {space} {extracts} />
{:else}
	<ExtractItem {extracts} selectedId={id} />
{/if}
