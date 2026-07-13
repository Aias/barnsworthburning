<script lang="ts">
	import { displayTitle, type RecordLink } from '$lib/records';
	import type { LucideIcon } from '@lucide/svelte';
	import Link from './Link.svelte';

	interface RelationListProps {
		items: RecordLink[];
		label: string;
		symbol: LucideIcon;
		maxChildren?: number;
	}

	let { items, label, symbol, maxChildren = 5 }: RelationListProps = $props();

	let showAllChildren = $state(false);

	const expandList = () => {
		showAllChildren = true;
	};

	let isTruncated = $derived(showAllChildren ? false : items?.length > maxChildren);
	let displayedItems = $derived(showAllChildren ? items?.slice() : items?.slice(0, maxChildren));

	$effect(() => {
		showAllChildren = false;
	});
</script>

{#if items?.length > 0}
	{@const Symbol = symbol}
	<div class="relation-list" title={label}>
		<Symbol class="relation-symbol" />
		<ol>
			{#each displayedItems as item (item.id)}
				<li><Link record={item}>{displayTitle(item)}</Link></li>
			{/each}
			{#if isTruncated}
				<li class="show-more">
					<button onclick={expandList} class="link">+{items.length - maxChildren} More</button>
				</li>
			{/if}
		</ol>
	</div>
{/if}

<style>
	.relation-list {
		display: block;
		position: relative;
		padding-inline-start: 1.5em;
		color: var(--link);
		font-family: var(--font-stack-mono);
		overflow: hidden;
		white-space: break-spaces;
		text-overflow: ellipsis;

		& :global(.relation-symbol) {
			position: absolute;
			inset-inline-start: 0;
			inset-block-start: calc((1lh - 1em) / 2);
			color: var(--hint);
		}

		ol {
			display: inline;
			margin: 0;
			padding: 0;
			list-style-type: none;
		}
	}
	li {
		display: inline;
		& + li::before {
			content: '/';
			margin-block: 0;
			margin-inline: 0.5em;
			color: var(--hint);
		}
	}
	.show-more {
		margin-inline-start: -1ch;

		/* Remove extra white space. */

		button {
			color: var(--hint);
			&:hover {
				color: var(--accent);
			}
		}
	}
</style>
