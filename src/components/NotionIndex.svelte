<script>
	import { lastFirst } from '$helpers/names';
	import SectionSeparator from './Index.SectionSeparator.svelte';
	import SettingsButton from './Index.SettingsButton.svelte';
	import IndexItem from './Index.IndexItem.svelte';

	let { indexEntries, ...restProps } = $props();
</script>

<nav {...restProps} class:index-container={true}>
	<menu class="index">
		<li>
			<a href="./">About</a>
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
	nav {
		--cantilever: 0.5rem;
		--border-width: 0.25rem;
		flex: 1;
		overflow-y: auto;
		padding: 0 calc(var(--cantilever) + var(--border-width));
		margin: 0 calc(-1 * var(--cantilever) + var(--border-width));
	}

	menu {
		margin: 0 0 0 calc(-1 * var(--cantilever));
		padding: 0;
		list-style-type: none;
		column-width: 23ch;
		column-gap: var(--padding);
		font-size: var(--font-size-small);
	}

	.index > :global(li) {
		--indent: 1em;
		padding-left: calc(var(--indent) + var(--cantilever));
		padding-right: var(--cantilever);
		padding-top: 1px;
		padding-bottom: 1px;
		text-indent: calc(-1 * var(--indent));
		transition: background-color 0.25s;
	}
</style>
