<script lang="ts">
	import { page } from '$app/state';
	import Link from '$components/Link.svelte';
	import { displayTitle, type IndexEntry } from '$lib/records';
	import type { HTMLOlAttributes } from 'svelte/elements';

	interface IndexProps extends HTMLOlAttributes {
		entries: IndexEntry[];
	}
	let { entries, ...restProps }: IndexProps = $props();

	let currentId = $derived(page.params?.id);

	const index = $derived(
		[...entries].sort((a, b) => displayTitle(a).localeCompare(displayTitle(b)))
	);
</script>

<ol class="index" class:themed={true} {...restProps}>
	{#each index as entry (entry.id)}
		<li class="index-entry">
			<Link class="entity-link" record={entry} active={String(entry.id) === currentId}>
				{displayTitle(entry)}
			</Link>&nbsp;<span class="count">{entry.count}</span>
		</li>
	{/each}
	<li class="index-entry">
		<hr role="presentation" class="section-break" />
	</li>
	<li class="index-entry">
		<Link href="/records/26716">About</Link>
	</li>
	<li class="index-entry">
		<Link href="/feed.xml" data-sveltekit-preload-data="off">RSS Feed</Link>
	</li>
	<li class="index-entry">
		<Link href="/records/27520">Contact</Link>
	</li>
	<li class="index-entry">
		<Link href="https://github.com/Aias/barnsworthburning" target="_blank">Source</Link>
	</li>
</ol>

<style>
	.index {
		column-width: 25ch;
		column-gap: 2em;
		flex: 0 1 auto;
		overflow: auto;
		margin-bottom: 1lh;
	}
	.section-break {
		margin-block: 0.5lh;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 1lh;
		border: none;

		&::before {
			content: '⁘\2007\2007⁘\2007\2007⁘';
			display: inline-block;
			color: var(--hint);
		}
	}
</style>
