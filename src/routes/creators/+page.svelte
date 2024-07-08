<script lang="ts">
	import cache from '$lib/cache.svelte';
	import CreatorList from '../app/CreatorList.svelte';

	let { data } = $props();

	$effect(() => {
		cache.addCreators(data.recentCreators);
	});

	const cachedCreators = $derived(cache.allCreators);
</script>

<svelte:head>
	<title>barnsworthburning</title>
</svelte:head>
<CreatorList creators={cachedCreators} />
