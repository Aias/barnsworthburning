<script lang="ts">
	import ExtractList from '../app/ExtractList.svelte';
	import SpaceList from '../app/SpaceList.svelte';
	import CreatorList from '../app/CreatorList.svelte';

	let { data } = $props();

	let { recentCreators, recentSpaces, recentExtracts } = $derived(data);
</script>

{#if recentCreators}
	<CreatorList creators={recentCreators} />
{:else if recentSpaces}
	<SpaceList spaces={recentSpaces} />
{:else if recentExtracts}
	<ExtractList extracts={recentExtracts} />
{/if}
