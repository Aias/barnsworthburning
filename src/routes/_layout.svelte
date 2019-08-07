<script>
	import Nav from '../components/Nav.svelte';
	import Toolbar from '../components/Toolbar.svelte';
	import Header from '../components/Header.svelte';

	let title = 'barnsworthburning.net';
	let description =
		'The personal website / portfolio / commonplace book of Nick Trombley, software designer / web developer.';
	let keywords =
		'Nick, Nicholas, Trombley, portfolio, design, designer, barnsworthburning, barns worth burning, development, front-end, commonplace book,';

	export let segment;
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content="{title}" />
	<meta name="Description" content="{description}" />
	<meta property="og:description" content="{description}" />
	<meta name="keywords" content="{keywords}" />
</svelte:head>

<div class="🌞">
	<header>
		<Header />
	</header>
	<main>
		<slot></slot>
	</main>
	<aside>
		<Toolbar />
	</aside>
	<footer>
		<Nav currentPage={segment} />
	</footer>
</div>

<style>
	div {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		height: 100%;
		overflow: hidden;
		color: var(--text-primary);
		background-color: var(--layer-bg);

		display: grid;
		grid-template-columns: [header-start toolbar-start] auto [header-end main-start footer-start] 1fr [main-end toolbar-end footer-end];
		grid-template-rows: [toolbar-start] auto [toolbar-end header-start main-start] 1fr [header-end footer-start  main-end] auto [footer-end];
	}

	aside {
		grid-area: toolbar;
		margin: 1rem 3rem 0.5rem 3rem;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	header {
		grid-area: header;
	}
	main {
		grid-area: main;
		overflow-y: auto;
		padding: 0 3rem 1rem 2rem;
	}
	footer {
		grid-area: footer;
		z-index: 19;
		margin: 0 2rem 1rem 1rem;
	}


	@media(max-width: 950px) {
		div {
			position: relative;
			height: auto;
			min-height: 100vh;
			overflow: initial;
			grid-template-columns: [header-start main-start footer-start] 1fr [header-end toolbar-start] auto [toolbar-end main-end footer-end];
			grid-template-rows: [toolbar-start header-start] auto [header-end toolbar-end main-start] 1fr [main-end footer-start] auto [footer-end];
		}

		header {
			margin-top: 1rem;
			margin-bottom: 1rem;
		}

		footer {
			position: sticky;
			position: -webkit-sticky;
			bottom: 1rem;
		}

		header, aside, footer, main {
			margin-left: 0;
			margin-right: 0;
			padding-left: 1rem;
			padding-right: 1rem;
		}
	}
</style>
