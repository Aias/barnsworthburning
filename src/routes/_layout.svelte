<script context="module">
	import select from '../helpers/select.js';

	export async function preload(page, session) {
		const creators = await select('creators', {
			fields: ['full_name', 'last_name', 'extracts', 'spaces', 'last_updated', 'connections_last_updated', 'slug', 'num_extracts', 'num_fragments'],
			filterByFormula: `{num_extracts} > 0`
		})(this.fetch);

		const spaces = await select('spaces', {
			fields: ['topic', 'extracts', 'creators', 'last_updated', 'connections_last_updated'],
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
		<slot />
	</main>
</div>

<style>
	div {
		--padding: 2rem;
		display: flex;
		padding: var(--padding);
	}
	header {
		flex: 1;
		min-width: 250px;
		max-height: calc(100vh - 2 * var(--padding));
		position: sticky;
		top: var(--padding);
		overflow-y: auto;
		padding: 0 1rem;
		margin: 0 -1rem;
	}
	main {
		margin-left: 2rem;
	}
	main:empty {
		display: none;
	}
</style>
