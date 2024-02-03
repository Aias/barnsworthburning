<script>
	import Link from './Link.svelte';
	const { items, label, symbol, maxChildren = 5 } = $props();

	let showAllChildren = $state(false);
	const expandList = () => {
		showAllChildren = true;
	};
	const isTruncated = $derived(!showAllChildren && items?.length > maxChildren);
	const displayedItems = $derived(showAllChildren ? items?.slice() : items?.slice(0, maxChildren));

	$effect(() => {
		items;
		showAllChildren = false;
	});
</script>

{#if items?.length > 0}
	<ol class="relation-list" data-symbol={symbol} title={label}>
		{#each displayedItems as item (item.id)}
			<li><Link toExtract={item.id}>{item.name}</Link></li>
		{/each}
		{#if isTruncated}
			<li class="show-more">
				<button on:click={expandList} class="link caption">+{items.length - maxChildren} More</button>
			</li>
		{/if}
	</ol>
{/if}

<style lang="scss">
	.relation-list {
		display: block;
		position: relative;
		margin: 0;
		padding: 0 0 0 20px;
		list-style-type: none;
		color: var(--link);
		font-family: var(--font-stack-mono);

		&::before {
			content: attr(data-symbol);
			position: absolute;
			left: 0;
			color: var(--hint);
		}
	}
	li {
		display: inline;
		& + li::before {
			content: '/';
			margin: 0 0.5em;
			color: var(--hint);
		}
	}
	.show-more {
		margin-left: -1ch; // Remove extra white space.
	}
</style>
