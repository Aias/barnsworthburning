<script>
	import '$styles/app.css';
	import { page } from '$app/stores';

	import Header from '$components/Header.svelte';
	import Gallery from '$components/Gallery.svelte';
	import Index from '$components/Index.svelte';

	let { data } = $props();

	let pageParams = $derived($page?.params || {});
	let hasParams = $derived(Object.keys(pageParams).length > 0);
	let searchParams = $derived($page.url.searchParams);
	let creator = $derived(searchParams.get('creator'));
	let space = $derived(searchParams.get('space'));

	let gallery = $state();
	let meta = $state();

	let indexEntries = $derived(data.index.sort((a, b) => a.label.localeCompare(b.label)));

	let muteLinks = $derived(hasParams || creator || space);

	$effect(async () => {
		if (creator) {
			const data = await getGallery('creator', creator);
			meta = data.creator;
			gallery = data.gallery;
		} else if (space) {
			const data = await getGallery('space', space);
			meta = data.space;
			gallery = data.gallery;
		}
	});

	async function getGallery(entityType, entityId) {
		const response = await fetch(`/api/gallery/${entityType}/${entityId}`)
			.then((r) => r.json())
			.catch(console.error);
		if (response) {
			return response;
		}
	}
</script>

<Header class="app-header" />
<main class="app-content">
	<Index entries={indexEntries} class={`index ${muteLinks ? 'unthemey' : ''}`} />
	{#if creator || space}
		<Gallery {gallery} {meta} class="gallery" />
	{/if}
	<article class="extract-panel chromatic"><slot /></article>
</main>

<style lang="scss" global>
	.app {
		--padding: 1.5rem;
		display: flex;
		flex-direction: column;
		height: 100%;
		flex: 0 0 auto;
	}
	.app-content {
		padding: var(--padding);
		display: flex;
		flex-direction: row;
		gap: var(--padding);
		height: 100%;
		flex-grow: 1;
		overflow-x: auto;
		overflow-y: hidden;
		align-items: stretch;

		> * {
			overflow-y: auto;
		}
	}
	.index {
		min-width: 12rem;
	}
	.gallery {
		flex: 0 1 100%;
	}
	.extract-panel {
		padding: var(--padding);
		margin: calc(-1 * var(--padding));
		margin-inline-start: 0;
		background-color: var(--background);
		border-left: 1px solid var(--edge);
		flex: 0 1 30rem;
		min-width: 25rem;

		&:empty {
			display: none;
		}
	}
</style>
