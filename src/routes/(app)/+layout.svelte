<script>
	import '$styles/app.css';
	import exists from '$helpers/exists';
	import { page } from '$app/stores';

	import Header from '$components/Header.svelte';
	import Index from '$components/Index.svelte';

	export let data;

	let muteLinks = exists($page?.params.extractId);
</script>

<Header class="app-header" />
<main class="app-content">
	<Index creators={data.creators} spaces={data.spaces} class={`index ${muteLinks ? 'unthemey' : ''}`} />
	<article class="extract-panel chromatic"><slot /></article>
</main>

<style lang="scss">
	.app-content {
		padding: var(--padding);
		display: flex;
		flex-direction: row;
		gap: var(--padding);
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
