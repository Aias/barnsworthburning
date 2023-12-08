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
	const testSections = ['light', 'dark', 'light chromatic', 'dark chromatic'];
</script>

<main>
	{#each testSections as testClass}
		<section class={testClass}>
			<h2>{testClass}</h2>
			<div>
				{#each themes as { mode, palette, chroma }}
					<TestCard {mode} {palette} {chroma} />
				{/each}
			</div>
		</section>
	{/each}
</main>

<style lang="scss">
	h2 {
		text-transform: capitalize;
	}
	section {
		padding: 1rem;
		background-color: var(--background);
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	div {
		--gap: 1rem;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: var(--gap);
	}

	div > :global(*) {
		flex: 0 0 calc(100% / 3 - var(--gap));
	}
</style>
