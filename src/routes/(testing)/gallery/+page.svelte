<script>
	import '$styles/app.css';
	import { page } from '$app/stores';

	import Extract from '$components/Extract.svelte';

	const searchParams = $derived($page.url.searchParams);
	const creator = $derived(searchParams.get('creator'));
	const space = $derived(searchParams.get('space'));

	let gallery = $state();

	$effect(async () => {
		if (creator) {
			const data = await getGallery('creator', creator);
			gallery = data.gallery;
		} else if (space) {
			const data = await getGallery('space', space);
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

<ul>
	<li><a href="?creator=recaR62tQy0mFgzgE">Christopher Alexander</a></li>
	<li><a href="?creator=recUl87Cd65bPFBcF">Alan Jacobs</a></li>
	<li><a href="?creator=rec97tRUYZBhAs6rZ">Nick Trombley</a></li>
</ul>

<div class="layout">
	{#if creator && gallery}
		{#each gallery as extract (extract.id)}
			<!-- <Component {extract} /> -->
			<Extract {extract} class="card" />
		{/each}
	{/if}
</div>

<style>
	.layout {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
	}
</style>
