<script lang="ts">
	import Link from './Link.svelte';
	import type { ILinkedRecord } from '$types/Airtable';

	interface TopicListProps {
		topics: ILinkedRecord[];
	}
	let { topics }: TopicListProps = $props();
</script>

{#if topics}
	<ul class="tag-list">
		{#each topics as topic (topic.id)}
			<li class="tag"><Link toType="space" toId={topic.id}>{topic.name}</Link></li>
		{/each}
	</ul>
{/if}

<style>
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
		text-transform: uppercase;

		&::before {
			content: '#';
			display: inline;
			margin-inline-end: 0.5ch;
			color: var(--hint);
		}
	}
	.tag :global(a) {
		color: var(--accent);
		&:hover {
			color: var(--link);
		}
	}
</style>
