<script lang="ts">
	import cache from '$lib/cache.svelte';
	import SpaceList from '../app/SpaceList.svelte';

	let { data } = $props();

	$effect(() => {
		cache.addSpaces(data.recentSpaces);
	});

	const cachedSpaces = $derived(cache.allSpaces);
</script>

<svelte:head>
	<title>barnsworthburning</title>
</svelte:head>
<SpaceList spaces={cachedSpaces} />
