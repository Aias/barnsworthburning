<script lang="ts">
	import cache from '$lib/cache.svelte';
	import { entityTypes, type EntityType } from '$helpers/params';

	type IndexEntry = {
		type: EntityType;
		name: string;
		id: string;
		count: number;
	};

	let currentSort = $state('name');
	let nameFilter = $state('');

	const index = $derived.by(() => {
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
		const all = [...creators, ...spaces]
			.sort(currentSort === 'name' ? sortByName : sortByCount)
			.filter((entry) => entry.name.toLowerCase().includes(nameFilter.toLowerCase()));

		return all;
	});

	function sortByCount(a: IndexEntry, b: IndexEntry) {
		return b.count - a.count;
	}
	function sortByName(a: IndexEntry, b: IndexEntry) {
		return a.name.localeCompare(b.name);
	}
</script>

{#snippet sectionBreak()}
	<li class="section-break center">
		<span class="text-hint">⁘  ⁘  ⁘</span>
	</li>
{/snippet}

<section class="index-container">
	<ol class="index">
		<li><a href="/creators">Creators</a></li>
		<li><a href="/spaces">Spaces</a></li>
		<li><a href="/extracts">Extracts</a></li>
		{@render sectionBreak()}
		<li class="controls">
			<input class="inline" type="search" bind:value={nameFilter} placeholder="Filter" />
		</li>
		{#each index as entry (entry.id)}
			<li class="index-entry">
				<a class="name" href="/{entry.type.urlParam}/{entry.id}">
					{entry.name}
				</a>&nbsp;<span class="count">{entry.count}</span>
			</li>
		{/each}
	</ol>
</section>

<style lang="scss">
	.index-container {
		font-size: var(--font-size-small);
		column-width: 25ch;
		column-gap: 2em;
	}
	.index {
		padding: 0;
		list-style-type: none;
	}
	// .section-break {
	// 	margin: 0.5lh 0;
	// }
	.controls {
		display: flex;
		margin: 0.5lh 0;

		input {
			flex: 1;
		}
	}
	.index-entry {
		--indent: 1.5em;
		padding-left: var(--indent);
		text-indent: calc(-1 * var(--indent));

		&:hover .count {
			color: var(--secondary);
		}
	}
	.count {
		margin-left: 1em;
		color: var(--hint);
		transition: color var(--transition-snappy);
	}
</style>
