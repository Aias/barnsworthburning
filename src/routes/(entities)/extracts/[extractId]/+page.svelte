<script lang="ts">
	import cache from '$lib/cache.svelte';
	// import { extractHierarchy } from '$lib/extractHierarchy.svelte';
	// import { page } from '$app/stores';

	let { data } = $props();
	// let selectedId = $page.params.extractId;

	$effect(() => {
		cache.addExtracts(data.selectedExtractData);
	});

	// let hierarchy = $derived(extractHierarchy(selectedId));

	// $inspect(hierarchy);
</script>

<article>
	{JSON.stringify(data.selectedExtractData, null, 2)}
</article>
