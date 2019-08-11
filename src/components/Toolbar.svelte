<script>
	import { isDarkMode } from '../stores';
	import getEmojiForTheme from '../helpers/getEmojiForTheme';

	import Link from './Link.svelte';
	import RSS from './icons/RSS.svelte';
	import Github from './icons/Github.svelte';
	import Spotify from './icons/Spotify.svelte';
	import LinkedIn from './icons/LinkedIn.svelte';
</script>

<div>
	<button title="Toggle theme" on:click="{() => isDarkMode.set(!$isDarkMode)}">{getEmojiForTheme($isDarkMode)}</button>
	<Link href="https://barnsworthburning-api.netlify.com/.netlify/functions/feed"><RSS /></Link>
	<Link href="https://www.linkedin.com/in/nick-trombley/"><LinkedIn /></Link>
	<Link href="https://github.com/Aias"><Github /></Link>
	<Link href="https://open.spotify.com/user/223hhvix27azj60a9a80jelq3?si=2RpG1aWiTK6edlf_Uskjog"><Spotify /></Link>
</div>

<style>
	div {
		display: inline-grid;
		grid-gap: 1rem;
		grid-template-columns: repeat(5, auto);
		align-items: flex-end;
		justify-items: center;
	}

	button {
		padding: 0;
		border: none;
		font-size: 1.5rem;
		line-height: 1;
		background-color: transparent;
		cursor: pointer;
	}

	div :global(.icon) {
		font-size: 1.5rem;
		line-height: 1;
	}

	@media(max-width: 950px) {
		div {
			grid-template-rows: repeat(3, 1fr);
			grid-template-columns: repeat(2, 1fr);
		}

		button {
			grid-column: 1 / span 2;
			justify-self: flex-end;
		}
	}
</style>