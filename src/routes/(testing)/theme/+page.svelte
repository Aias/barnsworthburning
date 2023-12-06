<script>
	import '$styles/app.css';

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
	const testSections = [
		'light',
		'dark',
		'light chromatic',
		'dark chromatic'
	];
</script>

{#snippet testCard({ mode, palette, chroma })}
<article class={`${mode || ''} ${palette || ''} ${chroma || ''}`}>
	<h3>Attention to Detail</h3>
	<p>Truly functional design only comes from the most careful and intense attention to detail.</p>
	<a href="./">Christopher Alexander</a>
	<ul>
		{#if mode}<li>#{mode}</li>{/if}
		{#if palette}<li>#{palette}</li>{/if}
		{#if chroma}<li>#{chroma}</li>{/if}
	</ul>
</article>
{/snippet}

<main>
	{#each testSections as testClass}
		<section class={testClass}>
			<h2>{testClass}</h2>
			<div>
				{#each themes as { mode, palette, chroma }}
					{@render testCard({ mode, palette, chroma })}
				{/each}		
			</div>
		</section>
	{/each}	
</main>


<style lang="scss">
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

	article {
		padding: 1rem;
		border: 1px solid var(--divider);
		border-radius: 4px;
		background-color: var(--paper);
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		&:hover {
			border-color: var(--border);
			background-color: var(--container);
			transition: all 200ms;
		}
	}

	h2, h3 {
		text-transform: capitalize;
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
