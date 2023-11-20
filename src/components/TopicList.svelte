<script>
	let { topics = [] } = $props();
</script>

{#if topics?.length > 0}
	<ul class="tag-list">
		{#each topics as topic (topic.id)}
			<li class="tag"><a href="/spaces/{topic.id}">{topic.name}</a></li>
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
