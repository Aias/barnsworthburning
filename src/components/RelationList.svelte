<script>
	let { items = [], label, symbol, maxChildren = 5 } = $props();

	let showAllChildren = $state(false);
	const expandList = () => {
		showAllChildren = true;
	};
	let isTruncated = $derived(!showAllChildren && items.length > maxChildren);
	let displayedItems = $derived(showAllChildren ? items.slice() : items.slice(0, maxChildren));
</script>

{#if items.length > 0}
	<ol class="relation-list text-mono" data-symbol={symbol} title={label}>
		{#each displayedItems as child, i}
			<li>{child}</li>
		{/each}
		{#if isTruncated}
			<li>
				<button onclick={expandList} class="link caption">+{items.length - maxChildren} More</button>
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

		&::before {
			content: attr(data-symbol);
			position: absolute;
			left: 0;
			color: var(--hint);
		}
	}
	li {
		display: inline;

		& + li {
			position: relative;
			&::before {
				content: ' / ';
				color: var(--hint);
				display: inline;
			}
		}
	}
</style>
