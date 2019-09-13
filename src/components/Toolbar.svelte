<script>
	import { isDarkMode } from '../stores';
	import getEmojiForTheme from '../helpers/getEmojiForTheme';

	import Link from './Link.svelte';
	import RSS from './icons/RSS.svelte';
	import Github from './icons/Github.svelte';
	import Airtable from './icons/Airtable.svelte';
</script>

<div>
	<button title="Toggle theme" on:click="{() => isDarkMode.set(!$isDarkMode)}">{getEmojiForTheme($isDarkMode)}</button>
	<Link title="RSS Feed" href="https://barnsworthburning-api.netlify.com/.netlify/functions/feed"><RSS /></Link>
	<Link title="Airtable" href="https://airtable.com/shrImoxRyZoDYdNg2/"><Airtable /></Link>
	<Link title="Github" href="https://github.com/Aias/barnsworthburning"><Github /></Link>
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
			grid-template-rows: repeat(2, 1fr);
			grid-template-columns: repeat(2, 1fr);
		}

		button {
			grid-column: 1 / span 1;
			justify-self: flex-end;
		}
	}
</style>