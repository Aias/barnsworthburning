<script>
	import { stores } from '@sapper/app';
	import { derived } from 'svelte/store';
	import { isDarkMode, loading } from '../stores';
	import getEmojiForTheme from '../helpers/getEmojiForTheme';

	import Header from '../components/Header.svelte';
	import Loading from '../components/Loading.svelte';
	import SEO from '../components/SEO.svelte';

	let { preloading } = stores();
	let loadingany = derived([preloading, loading], ([$preloading, $loading]) => $preloading || $loading);

	export let segment;
</script>

<SEO />

<div class="{getEmojiForTheme($isDarkMode)}">
	<header>
		<Header {segment} />
	</header>
	<main>
		<slot></slot>
	</main>
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
		padding: 3rem 2rem 2rem 3rem;
		
		display: grid;
		grid-template-columns: [header-start toolbar-start loading-start] auto [header-end loading-end main-start footer-start] 1fr [main-end toolbar-end footer-end];
		grid-template-rows: [toolbar-start] auto [toolbar-end header-start loading-start main-start] 1fr [header-end loading-end footer-start  main-end] auto [footer-end];

		color: var(--text-primary);
		background-color: var(--layer-bg);

		transition: color 0.5s, background-color 0.5s;
	}

	header, main {
		position: relative;
	}

	header {
		grid-area: header;
		overflow-y: hidden;
	}

	main {
		grid-area: main;
		overflow-y: auto;
		padding: 0 1rem 0 1rem;
		scrollbar-color: var(--clr-scrollbar) transparent;
		scrollbar-width: thin;
	}

	@media(max-width: 750px) {
		div {
			position: relative;
			height: auto;
			min-height: 100vh;
			overflow: initial;
			grid-template-columns: [header-start loading-start main-start footer-start] 1fr [toolbar-start] auto [header-end toolbar-end main-end loading-end footer-end];
			grid-template-rows: [toolbar-start header-start loading-start] auto [header-end toolbar-end loading-end main-start] 1fr [main-end footer-start] auto [footer-end];
			padding: 1rem 0.5rem;
		}

		header {
			padding-bottom: 0.5rem;
			padding-left: 1rem;
		}

		header:after {
			content: '~';
			display: block;
			text-align: center;
			padding-top: 0.5rem;
		}

		header, main {
			margin-left: 0;
			margin-right: 0;
		}
	}
</style>
