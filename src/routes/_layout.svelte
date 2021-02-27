<script>
	export let segment;
	let creators;
	let spaces;
	let error;

	import select from '../helpers/select';
	import { stores, goto } from '@sapper/app';
	import { setContext, afterUpdate, tick, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { fade, slide } from 'svelte/transition';
	import { loading } from '../stores';

	import SEO from '../components/SEO.svelte';
	import Index from '../components/Index.svelte';
	import Loading from '../components/Loading.svelte';
	import Error from '../components/Error.svelte';

	try {
		goto(window.location.pathname);
	}
	catch(e) {

	}

	let { page, session } = stores();
	let activeParams = $page.params;
	const activeWindow = writable(activeParams.extract ? 'panel' : activeParams.slug || activeParams.entity ? 'gallery' : 'index');
	setContext('activeWindow', activeWindow);

	onMount(async () => {
		$loading = true;
		const [ creatorsQuery, spacesQuery ] = await Promise.all([
			select('creators', {
				fields: ['full_name', 'last_name', 'extracts', 'spaces', 'last_updated', 'connections_last_updated', 'slug', 'num_extracts', 'num_fragments'],
				view: 'By Count',
				maxRecords: 200
			})(fetch),
			select('spaces', {
				fields: ['topic', 'extracts', 'creators', 'last_updated', 'connections_last_updated'],
				view: 'By Count',
				maxRecords: 200
			})(fetch)
		]);
		
		if(creatorsQuery.error || spacesQuery.error) {
			creatorsQuery.error ? error = creatorsQuery.error : error = spacesQuery.error;
		}
		else {
			creators = creatorsQuery.records;
			spaces = spacesQuery.records;
		}
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

	afterUpdate(async () => {
		await tick();
		try {
			const container = document.getElementById("layout");
			const child = document.querySelector(`.layout__${$activeWindow}`);
			
			if(container && child) {
				container.scrollTo({
					left: child.offsetLeft,
					behavior: 'smooth'
				});	
			}
		}
		catch(error) {
			console.log("Could not scroll.", error);
		}
	});
</script>

<SEO />

<Loading />
<main id="layout" class="layout active--{$activeWindow}" in:fade="{{duration: 1000, delay: 500}}" class:segment="{segment}" class:panel-open="{activeParams.extract}">
	{#if creators && spaces}
	<Index {creators} {spaces} />
	{/if}
	<slot />
</main>

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
</style>
