<script>
	import '$styles/app.css';
	import exists from '$helpers/exists';
	import { lastFirst } from '$helpers/names';
	import { page } from '$app/stores';

	import Header from '$components/Header.svelte';
	import Index from '$components/Index.svelte';

	let { data } = $props();
	let creators = $derived(
		data.creators.map(({ sortAsIs, name, id, lastUpdated, numExtracts, ...creator }) => ({
			id,
			type: 'creator',
			label: sortAsIs ? name : lastFirst(name),
			count: numExtracts,
			time: new Date(lastUpdated),
			...creator
		}))
	);
	let spaces = $derived(
		data.spaces.map(({ topic, id, numExtracts, lastUpdated, ...space }) => ({
			id,
			type: 'space',
			label: topic,
			count: numExtracts,
			time: new Date(lastUpdated),
			...space
		}))
	);

	let indexEntries = $derived(creators.concat(spaces).sort((a, b) => a.label.localeCompare(b.label)));

	let muteLinks = $derived(exists($page?.params.extractId));
</script>

<Header class="app-header" />
<main class="app-content">
	<Index entries={indexEntries} class={`index ${muteLinks ? 'unthemey' : ''}`} />
	<article class="extract-panel chromatic"><slot /></article>
</main>

<style lang="scss" global>
	.app {
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
		overflow: hidden;
		align-items: stretch;

		> * {
			overflow-y: auto;
		}
	}
	.extract-panel {
		padding: var(--padding);
		margin: calc(-1 * var(--padding));
		margin-left: 0;
		background-color: var(--background);
		border-left: 1px solid var(--edge);
		width: 30rem;

		&:empty {
			display: none;
		}
	}
</style>
