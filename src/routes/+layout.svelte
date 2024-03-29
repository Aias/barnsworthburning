<script lang="ts">
	import '$styles/app.scss';
	import Header from '$components/Header.svelte';
	import SEO from '$components/SEO.svelte';
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

<SEO />
<Header class="app-header" />
<main class="app-content">
	{@render children()}
</main>
