<script context="module">
	export async function load({ fetch }) {
		const { creators, spaces } = await fetch('/index.json').then(res => res.json()).catch(e => {
			console.error('Failed to load index.')
		});

		return {
			props: {
				creators, 
				spaces				
			}
		}
	}
</script>

<script>
	export let creators;
	export let spaces;
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
<main id="layout" class="layout active--{$activeWindow}" in:fade="{{duration: 1000, delay: 500}}" class:panel-open="{activeParams.extract}">
	<Index {creators} {spaces} />
	<slot></slot>
</main>
{/if}
{#if error}
<Error {error} />
{/if}
