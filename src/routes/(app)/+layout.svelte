<script>
	import '$styles/app.css';
	import { page } from '$app/stores';

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
		if (creator) {
			getGallery('creator', creator);
		} else if (space) {
			getGallery('space', space);
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
	<!-- {#if creator || space}
		<Gallery {gallery} {meta} componentClass="gallery" />
	{/if}
	<article class="extract-panel chromatic"><slot /></article> -->
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
		min-width: 26rem;

		&:empty {
			display: none;
		}
	}
</style>
