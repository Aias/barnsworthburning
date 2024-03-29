<script lang="ts">
	import cache from '$lib/cache.svelte';

	const creators = $derived(cache.allCreators);
	$inspect(creators);
</script>

<ul>
	{#each creators as creator (creator.id)}
		<li>
			<strong>{creator.name}</strong>
			{#if creator.extracts}
				{#each creator.extracts as extract (extract.id)}
					<span>{extract.name}</span>
				{/each}
			{/if}
		</li>
	{/each}
</ul>

<style lang="scss">
	ul {
		--separation: 0.5ch;
		display: block;
		text-align: justify;
	}
	li {
		display: inline;
	}
	li + li {
		strong::before {
			display: inline;
			content: ' / ';
			font-weight: var(--font-weight-normal);
			color: var(--accent);
			padding-inline-start: var(--separation);
			padding-inline-end: var(--separation);
			break-after: avoid;
			break-before: avoid;
		}
	}
	li > * + * {
		&::before {
			display: inline;
			content: ' • ';
			color: var(--divider);
			padding-inline-start: var(--separation);
			padding-inline-end: var(--separation);
			break-after: avoid;
			break-before: avoid;
		}
	}
	strong {
		color: var(--primary);
	}
	span {
		color: var(--secondary);
	}
</style>
