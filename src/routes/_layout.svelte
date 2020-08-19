<script context="module">
	import select from '../helpers/select.js';

	export async function preload(page, session) {
		const creators = await select('creators', {
			fields: ['full_name', 'last_name', 'extracts', 'spaces', 'last_updated', 'slug'],
			filterByFormula: `{num_extracts} > 0`
		})(this.fetch);

		const spaces = await select('spaces', {
			fields: ['topic', 'extracts', 'creators', 'last_updated'],
			filterByFormula: `{num_extracts} > 1`
		})(this.fetch);

		return { creators, spaces };
	}
</script>

<script>
	import { stores } from '@sapper/app';
	import { derived } from 'svelte/store';
	import { isDarkMode, loading } from '../stores';
	import getEmojiForTheme from '../helpers/getEmojiForTheme';

	import SEO from '../components/SEO.svelte';
	import Index from '../components/Index.svelte';

	let { preloading } = stores();
	let loadingany = derived([preloading, loading], ([$preloading, $loading]) => $preloading || $loading);

	// export let segment;
	export let creators;
	export let spaces;
</script>

<SEO />

<div class="{getEmojiForTheme($isDarkMode)}">
	<header>
		<nav>
			<Index {creators} {spaces} />
		</nav>
	</header>
	<main>
		<slot></slot>
	</main>
</div>

<style>
	div {
		display: flex;
		padding: 2rem;
	}
	header {
		flex: 1;
	}
	main {
		overflow: hidden;
		border-left: 1px solid var(--divider);
		padding-left: 1rem;
		margin-left: 1rem;
	}
	main:empty {
		display: none;
	}
</style>
