<script lang="ts">
	import '$styles/app.css';
	import Header from '$components/Header.svelte';
	import cache from '$lib/cache.svelte';

	let { children, data } = $props();

	$effect(() => {
		if (data.extracts) {
			cache.addExtracts(data.extracts);
		}
		if (data.creators) {
			cache.addCreators(data.creators);
		}
		if (data.spaces) {
			cache.addSpaces(data.spaces);
		}
	});
</script>

<Header class="app-header" />
<main class="app-content">
	{@render children()}
</main>
