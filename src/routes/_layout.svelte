<script>
	import Nav from '../components/Nav.svelte';
</script>

<Nav />

<main>
	<slot></slot>
</main>

<style>
	main {
		padding: 0 var(--body-padding);
		margin-top: var(--body-padding);
	}
</style>