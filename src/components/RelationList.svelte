<script lang="ts">
	import { displayTitle, type RelationRow } from '#lib/records.js';
	import Link from './Link.svelte';

	interface RelationListProps extends RelationRow {
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
	<div class="relation-list" title={label}>
		{#if typeof symbol === 'string'}
			<span class="relation-label">{symbol}</span>
		{:else}
			{@const Symbol = symbol}
			<Symbol class="relation-symbol" />
		{/if}
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
		display: flex;
		gap: 1ch;
		color: var(--link);
		font-family: var(--font-stack-mono);
		overflow: hidden;
		white-space: break-spaces;
		text-overflow: ellipsis;

		& :global(.relation-symbol) {
			margin-block-start: calc((1lh - 1em) / 2);
			color: var(--hint);
		}

		.relation-label {
			flex-shrink: 0;
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
