<script>
	import Nav from '../components/Nav.svelte';

	let title = 'barnsworthburning.net';
	let description = 'The personal website / portfolio / commonplace book of Nick Trombley, software designer / web developer.';
	let keywords = 'Nick, Nicholas, Trombley, portfolio, design, designer, barnsworthburning, barns worth burning, development, front-end, commonplace book,';
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content="{title}" />
	<meta
		name="Description"
		content="{description}"
	/>
	<meta property="og:description" content="{description}" />
	<meta name="keywords" content="{keywords}" />
</svelte:head>

<div class="🌞">
	<Nav />

	<main>
		<slot></slot>
	</main>

	<footer></footer>	
</div>

<style>
	div {
		height: 100%;
		width: 100%;
		position: relative;
		overflow: auto;
		color: var(--text-primary);
		background-color: var(--layer-bg);
	}
	main {
		padding: 0 var(--space);
		margin-top: var(--space);
	}
</style>