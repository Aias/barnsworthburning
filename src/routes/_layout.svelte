<script>
	import Nav from '../components/Nav.svelte';
</script>

<svelte:head>
	<title>barnsworthburning.net</title>
</svelte:head>

<Nav />

<main>
	<slot></slot>
</main>

<footer></footer>

<style>
	main {
		padding: 0 var(--body-padding);
		margin-top: var(--body-padding);
	}
</style>