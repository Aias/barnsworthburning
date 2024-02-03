<script>
	import '$styles/app.css';
	import Header from '$components/Header.svelte';
	let { children } = $props();
</script>

<Header class="app-header" />
<main class="app-content">
	{@render children()}
</main>