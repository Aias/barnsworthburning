<script lang="ts">
	import '$styles/app.scss';
	import Header from '$components/Header.svelte';
	import SEO from '$components/SEO.svelte';
	import cache from '$lib/cache.svelte';
	import Index from '$components/Index.svelte';

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
<main class="app-container">
	<Index class="app-index" />
	<div class="app-content">
		{@render children()}
	</div>
</main>
