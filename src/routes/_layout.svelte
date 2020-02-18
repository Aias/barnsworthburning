<script>
	import { stores } from '@sapper/app';
	import { derived } from 'svelte/store';
	import { isDarkMode, loading } from '../stores';
	import getEmojiForTheme from '../helpers/getEmojiForTheme';

	import Nav from '../components/Nav.svelte';
	import Toolbar from '../components/Toolbar.svelte';
	import Header from '../components/Header.svelte';
	import Loading from '../components/Loading.svelte';

	let title = 'barnsworthburning.net';
	let description =
		'A commonplace book.';
	let keywords =
		'Nick Trombley, design, barnsworthburning, barns worth burning, commonplace book, reading, writing, art';

	let { preloading } = stores();
	let loadingany = derived([preloading, loading], ([$preloading, $loading]) => $preloading || $loading);

	export let segment;
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content="{title}" />
	<meta name="Description" content="{description}" />
	<meta property="og:description" content="{description}" />
	<meta name="keywords" content="{keywords}" />
	<meta name="theme-color" content="{$isDarkMode ? '#ebcc20' : '#b50007'}" />
	<meta name="monetization" content="$pay.stronghold.co/1a18f752bd394de4172a951e38d6e6bc816" />
</svelte:head>

<div class="{getEmojiForTheme($isDarkMode)}">
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
		<Nav currentPage="{segment === 'spaces' ? undefined : segment}" />
	</footer>
	{#if $loadingany}
	<Loading />
	{/if}
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
		
		display: grid;
		grid-template-columns: [header-start toolbar-start loading-start] auto [header-end loading-end main-start footer-start] 1fr [main-end toolbar-end footer-end];
		grid-template-rows: [toolbar-start] auto [toolbar-end header-start loading-start main-start] 1fr [header-end loading-end footer-start  main-end] auto [footer-end];

		color: var(--text-primary);
		background-color: var(--layer-bg);

		transition: color 0.5s, background-color 0.5s;
	}

	aside {
		grid-area: toolbar;
		margin: 1rem 2rem;
		display: flex;
		justify-content: flex-end;
		align-items: baseline;
	}

	header, main, footer, aside {
		position: relative;
	}

	header {
		grid-area: header;
		overflow-y: hidden;
	}
	main {
		grid-area: main;
		overflow-y: auto;
		padding: 0 2rem;
		margin-bottom: 1rem;
	}
	footer {
		grid-area: footer;
		z-index: 19;
		margin: 0 1rem 1rem 1rem;
	}

	@media(max-width: 950px) {
		div {
			position: relative;
			height: auto;
			min-height: 100vh;
			overflow: initial;
			grid-template-columns: [header-start loading-start main-start footer-start] 1fr [toolbar-start] auto [header-end toolbar-end main-end loading-end footer-end];
			grid-template-rows: [toolbar-start header-start loading-start] auto [header-end toolbar-end loading-end main-start] 1fr [main-end footer-start] auto [footer-end];
		}

		header {
			margin-top: 1rem;
			margin-bottom: 1rem;
		}

		footer {
			position: -webkit-sticky;
			position: sticky;
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
