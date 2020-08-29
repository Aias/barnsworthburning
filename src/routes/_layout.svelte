<script context="module">
	import select from '../helpers/select.js';

	export async function preload(page, session) {
		const creators = await select('creators', {
			fields: ['full_name', 'last_name', 'extracts', 'spaces', 'last_updated', 'connections_last_updated', 'slug', 'num_extracts', 'num_fragments'],
			view: 'By Count',
			maxRecords: 200
		})(this.fetch);

		const spaces = await select('spaces', {
			fields: ['topic', 'extracts', 'creators', 'last_updated', 'connections_last_updated'],
			view: 'By Count',
			maxRecords: 200
		})(this.fetch);

		return { creators, spaces };
	}
</script>

<script>
	export let creators;
	export let spaces;
	export let segment;
	
	import { stores } from '@sapper/app';
	import { isDarkMode } from '../stores';
	import getEmojiForTheme from '../helpers/getEmojiForTheme';

	import SEO from '../components/SEO.svelte';
	import Index from '../components/Index.svelte';

	// let { page, session } = stores();

	// const { entity, slug, extract } = $page.params;

	// $session.activeParams = $page.params;
	// $session.activeWindow = extract ? 'panel' : slug || entity ? 'gallery' : 'index';

	// $: {
	// 	const { entity: newEntity, slug: newSlug, extract: newExtract = [] } = $page.params;
	// 	const { entity: activeEntity, slug: activeSlug, extract: activeExtract = [] } = $session.activeParams;

	// 	let needsUpdate = false;
	// 	if(activeEntity && !newEntity) { // Navigating to index.
	// 		needsUpdate = true;
	// 		$session.activeWindow = 'index';
	// 	}
	// 	else if(newEntity !== activeEntity || newSlug !== activeSlug) {
	// 		needsUpdate = true;
	// 		$session.activeWindow = 'gallery';
	// 	}
	// 	else if(newExtract[0] !== activeExtract[0]) {
	// 		needsUpdate = true;
	// 		$session.activeWindow = 'panel';
	// 	}

	// 	if(needsUpdate) {
	// 		$session.activeParams = $page.params;
	// 	}
	// }
</script>

<SEO />

<div class="app-container {getEmojiForTheme($isDarkMode)}" class:layout="{segment}">
	<header>
		<div class="index-container">
			<Index {creators} {spaces} />
		</div>
	</header>
	<slot />
</div>

<style>
	.app-container {
		--padding: 2rem;
		display: flex;
		padding: var(--padding);
	}
	header {
		flex: 1;
		min-width: 200px;
		max-height: calc(100vh - 2 * var(--padding));
		position: sticky;
		top: var(--padding);
		overflow-y: auto;
		overflow-x: hidden;
		padding: 0 1rem;
		margin: 0 -1.5rem;
	}

	.index-container {
		position: relative;
	}

	header + :global(*) {
		margin-left: 2rem;
	}

	@media (max-width: 0px) {
		header {
			position: fixed;
			background-color: var(--text-primary);
			z-index: 1;
			width: 0;
			min-width: 0;
			top: 0;
			left: 0;
			bottom: 0;
			max-height: 100vh;
			padding: 1rem;
			margin: 0;
			border-right: 1px solid var(--divider);
			transition: background-color 0.25s, width 0.25s;
		}

		header > * {
			opacity: 0;
			transition: opacity 0.25s;
		}

		header:hover,
		header:active, 
		header:focus-within, 
		header:focus {
			background-color: var(--layer-bg);
			width: 300px;
		}

		header:hover > *,
		header:active > *, 
		header:focus-within > *, 
		header:focus > * {
			opacity: 1;
		}
	}
</style>
