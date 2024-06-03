<script lang="ts">
	import cache from '$lib/cache.svelte';
	import { page } from '$app/stores';
	import { entityTypes, type EntityType } from '$helpers/params';
	import TextInput from '$components/TextInput.svelte';
	import Link from '$components/Link.svelte';
	import ThemeSelector from './ThemeSelector.svelte';

	let { ...restProps } = $props();

	type IndexEntry = {
		type: EntityType;
		name: string;
		id: string;
		count: number;
	};

	let currentSort = $state('name');
	let nameFilter = $state('');

	const fullIndex = $derived.by(() => {
		const creators = cache.allCreators.map((c) => ({
			type: entityTypes.creator,
			name: c.name || 'Unknown',
			id: c.id,
			count: c.numExtracts
		}));
		const spaces = cache.allSpaces.map((s) => ({
			type: entityTypes.space,
			name: s.topic || 'general',
			id: s.id,
			count: s.numExtracts
		}));
		const all = [...creators, ...spaces].sort(
			currentSort === 'name' ? sortByName : sortByCount
		);

		return all;
	});

	$effect(() => {
		const routeId = $page.route.id;
		if (routeId) {
			nameFilter = '';
		}
	});

	const filteredIndex = $derived.by(() => {
		let filtered = fullIndex;
		if (nameFilter) {
			filtered = filtered.filter((entry) =>
				entry.name.toLowerCase().includes(nameFilter.toLowerCase())
			);
		}
		return filtered;
	});

	const numMissing = $derived(fullIndex.length - filteredIndex.length);

	function sortByCount(a: IndexEntry, b: IndexEntry) {
		return b.count - a.count;
	}
	function sortByName(a: IndexEntry, b: IndexEntry) {
		return a.name.localeCompare(b.name);
	}
</script>

<header class:themed={true} {...restProps}>
	<nav class="app-nav">
		<Link class="nav-link" href="/" data-icon="🗂️">Index</Link>
		<Link class="nav-link" href="/creators" data-icon="🧑‍🎨">Creators</Link>
		<Link class="nav-link" href="/spaces" data-icon="🏷️">Spaces</Link>
		<Link class="nav-link" href="/extracts" data-icon="📝">Extracts</Link>
		<Link class="nav-link" href="/search" data-icon="🔍">Search</Link>
	</nav>
	<hr role="presentation" class="section-break" />
	<form action="/search">
		<TextInput type="search" name="q" inline bind:value={nameFilter} placeholder="Filter..." />
		<button class="screenreader" type="submit">Search</button>
	</form>
	<ol class="index">
		{#each filteredIndex as entry (entry.id)}
			<li class="index-entry">
				<a class="name" href="/{entry.type.urlParam}/{entry.id}">
					{entry.name}
				</a>&nbsp;<span class="count">{entry.count}</span>
			</li>
		{/each}
		{#if numMissing > 0}
			{#each Array(numMissing) as _, i}
				<li class="index-entry extra" aria-hidden="true"></li>
			{/each}
		{/if}
	</ol>
	<hr role="presentation" class="section-break" />
	<menu class="settings">
		<li>
			<ThemeSelector />
		</li>
	</menu>
</header>

<style lang="scss">
	form {
		display: flex;
		margin-block: 0.5lh;

		:global(input) {
			flex: 1;
			text-align: center;
		}
	}
	.section-break {
		margin-block: 0.75lh;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 1lh;
		border: none;

		&::before {
			content: '⁘  ⁘  ⁘';
			display: inline-block;
			color: var(--hint);
		}
	}
	.index-entry {
		--indent: 1.5em;
		padding-inline-start: var(--indent);
		text-indent: calc(-1 * var(--indent));
		min-height: 1lh;

		.name {
			margin-inline-end: 1em;
		}

		.count {
			color: var(--hint);
			transition: color var(--transition-snappy);

			&:hover {
				color: var(--secondary);
			}
		}
	}
</style>
