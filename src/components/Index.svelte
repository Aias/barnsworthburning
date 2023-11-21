<script>
	import { lastFirst } from '$helpers/names';
	import SectionSeparator from './Index.SectionSeparator.svelte';
	import SettingsButton from './Index.SettingsButton.svelte';
	import IndexItem from './Index.IndexItem.svelte';

	export let creators, spaces;

	let selectedEntity;

	let primarySort = 'alpha';
	let entityType = 'all';

	const entityFilters = [
		{
			label: 'Everything',
			value: 'all'
		},
		{
			label: 'Creators',
			value: 'creator'
		},
		{
			label: 'Spaces',
			value: 'space'
		}
	];
	const sortFilters = [
		{
			label: 'Name',
			value: 'alpha'
		},
		{
			label: 'Count',
			value: 'count'
		},
		{
			label: 'Time',
			value: 'time'
		}
	];

	const filterList =
		(filter = 'all') =>
		(node) => {
			if (filter === 'all') {
				return true;
			} else {
				return node.entity === filter;
			}
		};

	const getTime = (obj, type = 'connections') => {
		switch (type) {
			case 'record':
				return new Date(obj.lastUpdated);
			case 'connections':
			default:
				return new Date(obj.lastUpdated);
		}
	};

	const getCount = (obj) => obj.numExtracts;

	const compareFields = (sort = 'alpha') => {
		switch (sort) {
			case 'alpha':
				return (a, b) => {
					const aName = (a.indexName || '').toLowerCase();
					const bName = (b.indexName || '').toLowerCase();
					return aName > bName ? 1 : aName < bName ? -1 : 0;
				};
			case 'time':
				return (a, b) => {
					return getTime(b) - getTime(a) === 0
						? getTime(b, 'record') - getTime(a, 'record')
						: getTime(b) - getTime(a);
				};
			case 'count':
				return (a, b) => {
					return getCount(b) - getCount(a);
				};
		}
	};

	$: index = creators
		.map((creator) => ({
			...creator,
			entity: 'creator',
			indexName: creator.sortAsIs ? creator.name : lastFirst(creator.name)
		}))
		.concat(spaces.map((space) => ({ ...space, entity: 'space', indexName: space.topic })))
		.filter(filterList(entityType))
		.sort(compareFields(primarySort));
</script>

<nav {...$$restProps} class:index-container={true}>
	<menu class="index">
		{#each entityFilters as filter}
			<SettingsButton
				selected={entityType === filter.value}
				labelPrefix="List"
				label={filter.label}
				onClick={() => {
					entityType = filter.value;
				}}
			/>
		{/each}
		<SectionSeparator />
		{#each sortFilters as filter}
			<SettingsButton
				selected={primarySort === filter.value}
				labelPrefix="By"
				label={filter.label}
				onClick={() => {
					primarySort = filter.value;
				}}
			/>
		{/each}
		<SectionSeparator />
		{#each index as node (node.id)}
			<IndexItem
				active={node.id === selectedEntity}
				onClick={() => {
					selectedEntity = node.id;
				}}
				href={`/${node.entity}/${node.id}`}
				label={node.indexName}
				count={node.numExtracts}
			/>
		{/each}
		<SectionSeparator />
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
