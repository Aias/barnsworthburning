<script>
	import '$styles/app.css';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	import Header from '$components/Header.svelte';
	import Gallery from '$components/Gallery.svelte';
	import Index from '$components/Index.svelte';

	export let data;

	$: pageParams = $page?.params || {};
	$: hasPageParams = Object.keys(pageParams).length > 0;
	$: searchParams = $page?.url?.searchParams || {};
	$: creator = searchParams.get('creator');
	$: space = searchParams.get('space');

	let gallery, meta;

	$: indexEntries = data?.index ? [...data.index].sort((a, b) => a.label.localeCompare(b.label)) : [];
	$: muteLinks = hasPageParams || creator || space;

	$: {
		if (browser) {
			// https://github.com/sveltejs/kit/issues/8536#issuecomment-1402504905
			if (creator) {
				getGallery('creator', creator);
			} else if (space) {
				getGallery('space', space);
			}
		}
	}

	async function getGallery(entityType, entityId) {
		const response = await fetch(`/api/gallery/${entityType}/${entityId}`)
			.then((r) => r.json())
			.catch(console.error);
		if (response) {
			meta = {
				type: entityType,
				[entityType]: response[entityType]
			};
			gallery = response.gallery;
		}
	}
</script>

<Header class="app-header" />
<main class="app-content">
	<Index entries={indexEntries} componentClass={`index ${muteLinks ? 'unthemey' : ''}`} />
	{#if creator || space}
		<Gallery {gallery} {meta} componentClass="gallery" />
	{/if}
	<slot />
</main>
