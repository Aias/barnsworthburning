<script context="module">
	import select from '../helpers/select';

	export async function load({ fetch }) {
		let creatorsReceived,
		spacesReceived;

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
			return {
				error
			}
		}
		else {
			creatorsReceived = creatorsQuery.records;
			spacesReceived = spacesQuery.records;

			return {
				props: {
					creatorsReceived, 
					spacesReceived				
				}
			}
		}
	}
</script>

<script>
	export let segment;
	export let creatorsReceived;
	export let spacesReceived;
	let creators;
	let spaces;
	let error;

	import { page, session } from '$app/stores';
	import { setContext, onMount, afterUpdate, tick } from 'svelte';
	import { writable } from 'svelte/store';
	import { fade, slide } from 'svelte/transition';
	import { loading } from '../stores';

	import SEO from '../components/SEO.svelte';
	import Index from '../components/Index.svelte';
	import Loading from '../components/Loading.svelte';
	import Error from '../components/Error.svelte';

	let activeParams = $page.params;
	const activeWindow = writable(activeParams.extract ? 'panel' : activeParams.slug || activeParams.entity ? 'gallery' : 'index');
	setContext('activeWindow', activeWindow);

	// $loading = true;

	onMount(async () => {
		// By waiting until after the first render to assign the needed variables,
		// we bypass a complete render, so export script doesn't start crawling internal links.
		creators = creatorsReceived;
		spaces = spacesReceived;

		// $loading = false;
	});

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
{#if creators && spaces}
<main id="layout" class="layout active--{$activeWindow}" in:fade="{{duration: 1000, delay: 500}}" class:segment="{segment}" class:panel-open="{activeParams.extract}">
	<Index {creators} {spaces} />
	<slot />
</main>
{/if}
{#if error}
<Error {error} />
{/if}
