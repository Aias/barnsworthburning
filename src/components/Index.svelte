<script lang="ts">
	import cache from '$lib/cache.svelte';
	import { entityTypes, type EntityType } from '$helpers/params';
	import TextInput from './TextInput.svelte';

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
	<li class="section-break">
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
			<TextInput type="search" inline bind:value={nameFilter} placeholder="Filter" />
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
	}
	.index {
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
		}
	}
	.section-break {
		margin-block: 0.75lh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.index-entry {
		--indent: 1.5em;
		padding-inline-start: var(--indent);
		text-indent: calc(-1 * var(--indent));

		&:hover .count {
			color: var(--secondary);
		}
	}
	.count {
		margin-inline-start: 1em;
		color: var(--hint);
		transition: color var(--transition-snappy);
	}
</style>
