<script>
	import '$styles/app.css';
	import TestCard from './TestCard.svelte';

	const themes = [
		{},
		{ palette: 'amber' },
		{ palette: 'grass' },
		{ chroma: 'chromatic' },
		{ palette: 'amber', chroma: 'chromatic' },
		{ mode: 'light', palette: 'indigo' },
		{ mode: 'light', palette: 'jade', chroma: 'chromatic' },
		{ mode: 'dark', palette: 'tomato' },
		{ mode: 'dark', palette: 'sky', chroma: 'chromatic' },
		{ chroma: 'neutral' },
		{ chroma: 'neutral', mode: 'dark' },
		{ chroma: 'neutral', palette: 'green' }
	];
</script>

<main class="light">
	{#each themes as { mode, palette, chroma }}
		<TestCard {mode} {palette} {chroma} />
	{/each}
</main>
<main class="dark">
	{#each themes as { mode, palette, chroma }}
		<TestCard {mode} {palette} {chroma} />
	{/each}
</main>
<main class="light chromatic">
	{#each themes as { mode, palette, chroma }}
		<TestCard {mode} {palette} {chroma} />
	{/each}
</main>
<main class="dark chromatic">
	{#each themes as { mode, palette, chroma }}
		<TestCard {mode} {palette} {chroma} />
	{/each}
</main>

<style>
	main {
		--gap: 1rem;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: var(--gap);
		padding: 1rem;
		background-color: var(--background);
	}

	main > :global(*) {
		flex: 0 0 calc(100% / 3 - var(--gap));
	}
</style>
