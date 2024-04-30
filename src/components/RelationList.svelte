<script lang="ts">
	import Link from './Link.svelte';
	import type { ILinkedRecord } from '$types/Airtable';

	interface RelationListProps {
		items: ILinkedRecord[];
		label: string;
		symbol: string;
		maxChildren?: number;
	}

	let { items, label, symbol, maxChildren = 5 }: RelationListProps = $props();

	let showAllChildren = false;

	const expandList = () => {
		showAllChildren = true;
	};

	let isTruncated = $derived(items?.length > maxChildren);
	let displayedItems = $derived(showAllChildren ? items?.slice() : items?.slice(0, maxChildren));

	$effect(() => {
		items;
		showAllChildren = false;
	});
</script>

{#if items?.length > 0}
	<ol class="relation-list" data-symbol={symbol} title={label}>
		{#each displayedItems as item (item.id)}
			<li><Link toType="extract" toId={item.id}>{item.name}</Link></li>
		{/each}
		{#if isTruncated}
			<li class="show-more">
				<button onclick={expandList} class="link test"
					>+{items.length - maxChildren} More</button
				>
			</li>
		{/if}
	</ol>
{/if}

<style lang="scss">
	.relation-list {
		display: block;
		position: relative;
		margin: 0;
		padding: 0;
		padding-inline-start: 1.5em;
		list-style-type: none;
		color: var(--link);
		font-family: var(--font-stack-mono);

		&::before {
			content: attr(data-symbol);
			position: absolute;
			inset-inline-start: 0;
			color: var(--hint);
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
		margin-inline-start: -1ch; // Remove extra white space.
	}
</style>
