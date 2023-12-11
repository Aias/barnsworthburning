<script>
	import Link from './Link.svelte';

	export let entries;
	export let componentClass;
</script>

<nav class={componentClass} class:index-container={true}>
	<menu>
		{#each entries as entry (entry.id)}
			<li class="index-item">
				<Link
					toCreator={entry.type === 'creator' ? entry.id : undefined}
					toSpace={entry.type === 'space' ? entry.id : undefined}>{entry.label}</Link
				>&nbsp;<span class="count">{entry.count}</span>
			</li>
		{/each}
		<li class="center text-hint">⁘&#8199;&#8199;⁘&#8199;&#8199;⁘</li>
		<li>
			<a href="/about">About</a>
		</li>
		<li>
			<a href="/feed.xml" target="_blank" rel="noreferrer">RSS Feed</a>
		</li>
		<li>
			<a href="https://github.com/Aias/barnsworthburning" target="_blank" rel="noreferrer">Source</a>
		</li>
	</menu>
</nav>

<style lang="scss">
	.index-container {
		--item-padding: 0.5rem;
		flex: 1;
		overflow-y: auto;
		overflow-x: hidden;
		padding: 0 1rem;
		margin: 0 -1rem;
	}

	menu {
		margin: 0;
		padding: 0;
		list-style-type: none;
		column-width: 23ch;
		column-gap: var(--padding);
		font-size: var(--font-size-small);
	}

	menu > li {
		--indent: 1.5em;
		text-indent: calc(-1 * var(--indent));
		padding-left: calc(var(--indent) + var(--item-padding));
		padding-right: var(--item-padding);
		padding-top: 1px;
		padding-bottom: 1px;
		transition: background-color 0.25s;
	}

	.index-item {
		.count {
			margin-left: 1em;
			text-align: right;
			color: var(--secondary);
			opacity: 0.25;
			transition: opacity 150ms;
		}
		&:hover {
			.count {
				opacity: 1;
			}
		}
		&:has(.active) {
			background-color: var(--main);
			:global(a) {
				color: var(--main-contrast);
			}
			.count {
				color: var(--main-contrast);
				opacity: 0.75;
			}
		}
	}
</style>
