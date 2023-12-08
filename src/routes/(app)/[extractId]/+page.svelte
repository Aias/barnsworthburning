<script>
	import Extract from '$components/Extract.svelte';

	export let data;

	$: extracts = data.extracts || [];
	$: currentId = data.currentId;

	$: parentExtract = extracts.find((e) => e.id === currentId);
	$: childExtracts = parentExtract?.children?.map((c) => extracts.find((e) => e.id === c.id));
</script>

{#if parentExtract}
	<header class="card">
		<Extract extract={parentExtract} />
	</header>
	{#if childExtracts}
		<ol>
			{#each childExtracts as child (child.id)}
				<li>
					<Extract extract={child} />
				</li>
			{/each}
		</ol>
	{/if}
{/if}

<style>
	header + ol {
		margin-top: var(--padding);
	}

	ol {
		list-style-type: none;
		padding: 0;
	}

	li + li::before {
		content: '∵';
		display: block;
		margin-top: 1.5rem;
		margin-bottom: 1.5rem;
		text-align: center;
		color: var(--hint);
	}
</style>
