<script>
	const themes = [
		{},
		{chroma: 'neutral'},
		{mode: 'light'},
		{chroma: 'chromatic'},
		{palette: 'indigo', chroma: 'chromatic'},
		{mode: 'dark', palette: 'indigo', chroma: 'chromatic'},
		{chroma: 'chromatic'},
		{palette: 'amber', chroma: 'chromatic'},
		{mode: 'dark', palette: 'amber', chroma: 'chromatic'},
		{palette: 'grass'},
		{palette: 'grass', chroma: 'chromatic'},
		{mode: 'dark', palette: 'grass', chroma: 'chromatic'},
		{palette: 'tomato'},
		{palette: 'tomato', chroma: 'chromatic'},
		{mode: 'dark', palette: 'tomato', chroma: 'chromatic'},
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

<main>
	{#each themes as theme}
		{@render card(theme)}
	{/each}
</main>

<style>
	main {
		--gap: 1rem;
		height: 100%;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: var(--gap);
		padding: 1rem;
		background-color: var(--background);
		overflow: auto;
	}

	main > :global(*) {
		flex: 1 0 calc(100%/3 - var(--gap));
	}

	section {
		padding: 1rem;
		border: 1px solid var(--divider);
		border-radius: 4px;
		background-color: var(--container);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
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
	li {
		
	}
</style>