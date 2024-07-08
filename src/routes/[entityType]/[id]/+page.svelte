<script lang="ts">
	import cache from '$lib/cache.svelte';
	import { capitalize } from '$helpers/grammar';
	import { page } from '$app/stores';
	import ExtractItem from '../../app/ExtractItem.svelte';
	import EntityItem from '../../app/EntityItem.svelte';

	let { data } = $props();

	let { creator, space, extracts } = $derived(data);
	let { id } = $derived($page.params);

	$effect.pre(() => {
		if (creator) cache.addCreators([creator]);
		if (space) cache.addSpaces([space]);
		cache.addExtracts(extracts);
	});

	let title = $derived.by(() => {
		const UNKNOWN = 'Unknown';
		if (creator) return creator.name ?? UNKNOWN;
		if (space) return capitalize(space.title || space.topic) ?? UNKNOWN;
		if (extracts) return cache.extractsById.get(id)?.title ?? UNKNOWN;
		return UNKNOWN;
	});
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

{#if creator || space}
	<EntityItem {title} {extracts} />
{:else}
	<ExtractItem extractId={id} />
{/if}
