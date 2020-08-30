<script>
	let creators;
	let spaces;
	export let segment;

	import { stores } from '@sapper/app';
	import select from '../helpers/select.js';
	import { setContext, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { fade, slide } from 'svelte/transition';
	import { loading } from '../stores';

	import SEO from '../components/SEO.svelte';
	import Index from '../components/Index.svelte';
	import Loading from '../components/Loading.svelte';

	let { page, session } = stores();
	let activeParams = $page.params;
	const activeWindow = writable(activeParams.extract ? 'panel' : activeParams.slug || activeParams.entity ? 'gallery' : 'index');
	setContext('activeWindow', activeWindow);

	onMount(async () => {
		$loading = true;
		creators = await select('creators', {
			fields: ['full_name', 'last_name', 'extracts', 'spaces', 'last_updated', 'connections_last_updated', 'slug', 'num_extracts', 'num_fragments'],
			view: 'By Count',
			maxRecords: 200
		})(fetch);

		spaces = await select('spaces', {
			fields: ['topic', 'extracts', 'creators', 'last_updated', 'connections_last_updated'],
			view: 'By Count',
			maxRecords: 200
		})(fetch);
		$loading = false;
	})

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

<Loading />
{#if creators && spaces}
<main class="app-container layout active--{$activeWindow}" in:fade="{{duration: 1000, delay: 500}}" class:segment="{segment}">
	<aside class="layout__index">
		<Index {creators} {spaces} />
	</aside>
	<slot />
</main>
{:else}
<blockquote out:slide="{{duration: 1000}}">
	I should have been a pair of ragged claws <br/>
	Scuttling across the floors of silent seas.
</blockquote>
{/if}

<style>
	blockquote {
		position: fixed;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		padding: 1rem;
		border: 0;
		background-color: var(--layer-bg);
	}

	.app-container {
		--padding: 2rem;
		display: flex;
		position: relative;
		align-items: flex-start;
	}

	.layout__index {
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
</style>
