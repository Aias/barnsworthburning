<script lang="ts">
	import cache from '$lib/cache.svelte';
	import { page } from '$app/stores';
	import { entityTypes, type EntityType } from '$helpers/params';
	import TextInput from './TextInput.svelte';

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

	const filteredIndex = $derived.by(() => {
		let filtered = fullIndex;
		const routeId = $page.route.id || '/';
		if (nameFilter) {
			filtered = filtered.filter((entry) =>
				entry.name.toLowerCase().includes(nameFilter.toLowerCase())
			);
		}
		if (routeId.includes('creators')) {
			filtered = filtered.filter((entry) => entry.type === entityTypes.creator);
		} else if (routeId.includes('spaces')) {
			filtered = filtered.filter((entry) => entry.type === entityTypes.space);
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

<section class:container={true} {...restProps}>
	<ol class="index">
		<li><a href="/">🗂️ Index</a></li>
		<li><a href="/creators">🧑‍🎨 Creators</a></li>
		<li><a href="/spaces">🏷️ Spaces</a></li>
		<li><a href="/extracts">📝 Extracts</a></li>
		<li><a href="/search">🔍 Search</a></li>
		<li class="section-break"></li>
		<li class="controls">
			<TextInput type="search" inline bind:value={nameFilter} placeholder="Filter..." />
		</li>
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
</section>

<style lang="scss">
	.container {
		font-size: var(--font-size-small);
	}
	.index {
		container-type: inline-size;
		padding: 0;
		list-style-type: none;
		column-width: 25ch;
		column-gap: 2em;
	}
	.controls {
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
	@container (max-width: 50ch) {
		.index {
			column-count: 1;
		}
		.extra {
			display: none;
		}
	}
</style>
