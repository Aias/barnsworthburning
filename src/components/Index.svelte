<script>
	import { lastFirst } from '$helpers/names';
	const { creators, spaces, ...rest } = $props();

	let selectedEntity = $state();

	let primarySort = $state('alpha');
	let entityType = $state('all');

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

	const getCount = (obj) => obj.numExtracts

	const compareFields = (sort = 'alpha') => {
		switch (sort) {
			case 'alpha':
				return (a, b) => {
					const aName = (a.indexName || '').toLowerCase();
					const bName = (b.indexName || '').toLowerCase();
					return aName > bName
						? 1
						: aName < bName
						? -1
						: 0;
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

	let index = $derived(creators
		.map((creator) => ({ ...creator, entity: 'creator', indexName: creator.sortAsIs ? creator.name : lastFirst(creator.name) }))
		.concat(spaces.map((space) => ({ ...space, entity: 'space', indexName: space.topic })))
		.filter(filterList(entityType))
		.sort(compareFields(primarySort)))
</script>

{#snippet sectionSeparator()}
	<li class="center text-hint">⁘&#8199;&#8199;⁘&#8199;&#8199;⁘</li>
{/snippet}

{#snippet settingsButton({selected, labelPrefix, label, onClick})}
	<li class:selected={selected} class="settings-item unthemey">
		<button class="settings-button link" on:click={onClick}>
			<span class="label-prefix">{labelPrefix}</span>{label}
		</button>
	</li>
{/snippet}

{#snippet indexItem({node, href = "./", label, count})}
	<li class:active={selectedEntity && (node.topic === selectedEntity || node.slug === selectedEntity)} class="index-item">
		<a href={'/recYQmlvBMSUV0Pe0'} on:click={() => {
			selectedEntity = node.topic || node.slug;
		}}>{label}</a>&nbsp;<span class="count">{count}</span>
	</li>
{/snippet}

<nav {...rest}>
	<menu>
		{#each entityFilters as filter}
			{@render settingsButton({
				selected: entityType === filter.value,
				labelPrefix: 'List',
				label: filter.label,
				onClick: () => {entityType = filter.value}
			})}
		{/each}
		{@render sectionSeparator()}
		{#each sortFilters as filter}
			{@render settingsButton({
				selected: primarySort === filter.value,
				labelPrefix: 'By',
				label: filter.label,
				onClick: () => {primarySort = filter.value}
			})}
		{/each}
		{@render sectionSeparator()}
		{#each index as node (node.id)}
			{@render indexItem({
				node: node,
				href: `/${node.entity}/${node.id}`,
				label: node.indexName,
				count: node.numExtracts
			})}
		{/each}
		{@render sectionSeparator()}
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

	li {
		--indent: 1em;
		padding-left: calc(var(--indent) + var(--cantilever));
		padding-right: var(--cantilever);
		padding-top: 1px;
		padding-bottom: 1px;
		text-indent: calc(-1 * var(--indent));
		transition: background-color 0.25s;
	}

	.settings-item {
		.settings-button {
			white-space: nowrap;
			text-decoration: none;
		}
		.label-prefix {
			padding-right: 1ch;
			visibility: hidden;
		}

		&.selected {
			border-left: var(--border-width) solid var(--main);
			margin-left: calc(-1 * var(--border-width));
			.settings-button {
				color: var(--link);
				font-weight: 500;	
			}
			.label-prefix {
				visibility: visible;
			}
		}
	}

	.index-item {
		.count {
			margin-left: 1em;
			text-align: right;
			color: var(--secondary);
			opacity: 0.25;
			transition: opacity 150ms;
		}
		&.active {
			background-color: var(--main);
			:global(a) {
				color: var(--main-contrast);
			}
			.count {
				color: var(--main-contrast);
				opacity: 0.75;
			}
		}
		&:hover {
			.count {
				opacity: 1;
			}
		}
	}
</style>