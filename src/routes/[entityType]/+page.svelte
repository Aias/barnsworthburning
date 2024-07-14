<script lang="ts">
	import cache from '$lib/cache.svelte';
	import ExtractList from '../app/ExtractList.svelte';
	import SpaceList from '../app/SpaceList.svelte';
	import CreatorList from '../app/CreatorList.svelte';

	let { data } = $props();

	let { recentCreators, recentSpaces, recentExtracts } = $derived(data);

	$effect.pre(() => {
		if (recentCreators) cache.addCreators(recentCreators);
		if (recentSpaces) cache.addSpaces(recentSpaces);
		if (recentExtracts) cache.addExtracts(recentExtracts);
	});
</script>

<svelte:head>
	<title>barnsworthburning</title>
</svelte:head>

{#if recentCreators}
	<CreatorList creators={recentCreators} />
{:else if recentSpaces}
	<SpaceList spaces={recentSpaces} />
{:else if recentExtracts}
	<ExtractList extracts={recentExtracts} />
{/if}
