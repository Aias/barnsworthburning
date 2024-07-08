<script lang="ts">
	import cache from '$lib/cache.svelte';
	import ExtractList from '../app/ExtractList.svelte';

	let { data } = $props();

	$effect(() => {
		cache.addExtracts(data.recentExtracts);
	});
</script>

<svelte:head>
	<title>barnsworthburning</title>
</svelte:head>
<ExtractList extracts={data.recentExtracts} />
