<script>
	import Nav from '../components/Nav.svelte';
	import Link from '../components/Link.svelte';

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
	<aside>
		<Link href="https://github.com/Aias">Github</Link>
		<Link href="https://open.spotify.com/user/223hhvix27azj60a9a80jelq3?si=2RpG1aWiTK6edlf_Uskjog">Spotify</Link>
	</aside>
	<header>

	</header>
	<main>
		<slot></slot>
	</main>
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
		grid-template-columns: [header-start toolbar-start main-start footer-start] 300px [header-end] 1fr [main-end toolbar-end footer-end];
		grid-template-rows: [toolbar-start] auto [toolbar-end header-start main-start] 1fr [footer-start  main-end] auto [header-end footer-end];
	}

	aside {
		grid-area: toolbar;
		margin: 0.5rem 3rem;
		display: flex;
		justify-content: flex-end;
	}
	aside > :global(a + a) {
		margin-left: 2rem;
	}

	header {
		grid-area: header;
	}
	main {
		grid-area: main;
		overflow-y: auto;
		padding: 0 3rem 1rem 1.5rem;
	}
	footer {
		grid-area: footer;
		z-index: 19;
		margin: 0 2rem 0.5rem 1rem;
	}
</style>
