<script>
	let { topics } = $props();
</script>

{#if topics}
<ul class="tag-list text-mono">
	{#each topics as topic}
	<li class="tag">{topic}</li>
	{/each}
</ul>
{/if}

<style lang="scss">
	.tag-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		column-gap: 1em;
		row-gap: 0;
	}
	.tag {
		color: var(--secondary);
		text-transform: uppercase;

		&::before {
			content: '#';
			display: inline;
			margin-right: 0.5ch;
			color: var(--hint);
		}
	}
</style>