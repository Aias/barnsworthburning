<script>
	const themes = [
		{},
		{palette: 'amber'},
		{ palette: 'grass'},
		{chroma: 'chromatic'},
		{ palette: 'amber', chroma: 'chromatic'},
		{ mode: 'light', palette: 'indigo'},
		{ mode: 'light', palette: 'jade', chroma: 'chromatic'},
		{ mode: 'dark', palette: 'tomato'},
		{ mode: 'dark', palette: 'sky', chroma: 'chromatic'},
	]
</script>

{#snippet card({mode, palette, chroma})}
	<section class={`${mode || ''} ${palette || ''} ${chroma || ''}`}>
		<h3>Attention to Detail</h3>
		<p>Truly functional design only comes from the most careful and intense attention to detail.</p>
		<a href="./">Christopher Alexander</a>
		<ul>
			{#if mode}<li>#{mode}</li>{/if}
			{#if palette}<li>#{palette}</li>{/if}
			{#if chroma}<li>#{chroma}</li>{/if}
		</ul>
	</section>
{/snippet}

<main class="light">
	{#each themes as theme}
		{@render card(theme)}
	{/each}
</main>
<main class="dark">
	{#each themes as theme}
		{@render card(theme)}
	{/each}
</main>
<main class="light chromatic">
	{#each themes as theme}
		{@render card(theme)}
	{/each}
</main>
<main class="dark chromatic">
	{#each themes as theme}
		{@render card(theme)}
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
		flex: 0 0 calc(100%/3 - var(--gap));
	}

	section {
		padding: 1rem;
		border: 1px solid var(--divider);
		border-radius: 4px;
		background-color: var(--paper);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	section:hover {
		border-color: var(--border);
		background-color: var(--container);
		transition: all 200ms;
	}

	h3 {
		color: var(--primary);
		text-transform: capitalize;
		font-weight: 400;
	}
	p {
		color: var(--display);
	}
	ul {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
		list-style: none;
		margin: 0;
		padding: 0;
		color: var(--hint);
		font-size: 0.75rem;
	}
</style>