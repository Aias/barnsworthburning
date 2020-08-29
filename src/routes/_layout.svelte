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
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store'

	import SEO from '../components/SEO.svelte';
	import Index from '../components/Index.svelte';

	let { page, session } = stores();

	let activeParams = $page.params;
	const activeWindow = writable(activeParams.extract ? 'panel' : activeParams.slug || activeParams.entity ? 'gallery' : 'index');
	setContext('activeWindow', activeWindow);

	$: {
		const { entity: newEntity, slug: newSlug, extract: newExtract = [] } = $page.params;
		const { entity: activeEntity, slug: activeSlug, extract: activeExtract = [] } = activeParams;

		let needsUpdate = false;
		if(activeEntity && !newEntity) { // Navigating to index.
			needsUpdate = true;
			$activeWindow = 'index';
		}
		else if(newEntity !== activeEntity || newSlug !== activeSlug) {
			needsUpdate = true;
			$activeWindow = 'gallery';
		}
		else if(newExtract[0] !== activeExtract[0]) {
			needsUpdate = true;
			$activeWindow = 'panel';
		}

		if(needsUpdate) {
			activeParams = $page.params;
		}
	}
</script>

<SEO />

<div class="app-container {getEmojiForTheme($isDarkMode)} active--{$activeWindow}" class:layout="{segment}">
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
		position: relative;
		align-items: flex-start;
	}
	header {
		flex: 1;
		min-width: 200px;
		max-height: calc(100vh - 2 * var(--padding));
		position: sticky;
		top: var(--padding);
		overflow-y: auto;
		overflow-x: hidden;
		padding: 0 var(--padding);
		margin: var(--padding) 0;
	}

	.index-container {
		position: relative;
	}

	header + :global(*) {
		margin-left: calc(-0.5 * var(--padding));
	}
</style>
