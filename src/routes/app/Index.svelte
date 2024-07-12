<script lang="ts">
	import cache from '$lib/cache.svelte';
	import { page } from '$app/stores';
	import { entityTypes, type EntityType } from '$helpers/params';
	import TextInput from '$components/TextInput.svelte';
	import Link from '$components/Link.svelte';

	let { ...restProps } = $props();

	type IndexEntry = {
		type: EntityType;
		name: string;
		id: string;
		count: number;
	};

	let currentSort = $state('name');
	let nameFilter = $state('');

	let pageParams = $derived($page.params || {});

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

	function sortByCount(a: IndexEntry, b: IndexEntry) {
		return b.count - a.count;
	}
	function sortByName(a: IndexEntry, b: IndexEntry) {
		return a.name.localeCompare(b.name);
	}
</script>

<!-- <form action="/search">
		<TextInput type="search" name="q" inline bind:value={nameFilter} placeholder="Filter..." />
		<button class="screenreader" type="submit">Search</button>
	</form> -->
<ol class="index" class:themed={true} {...restProps}>
	{#each filteredIndex as entry (entry.id)}
		{@const { type, name, id, count } = entry}
		<li class="index-entry">
			<Link
				class="entity-link"
				toType={type.key}
				toId={id}
				active={type.urlParam === pageParams.entityType && id === pageParams.id}
			>
				{name}
			</Link>&nbsp;<span class="count">{count}</span>
		</li>
	{/each}
	<li class="index-entry">
		<hr role="presentation" class="section-break" />
	</li>
	<li class="index-entry">
		<Link toType="extract" toId="rechxgCFt4OkQUsKD">About</Link>
	</li>
	<li class="index-entry">
		<Link href="/feed.xml" data-sveltekit-preload-data="off">RSS Feed</Link>
	</li>
	<li class="index-entry">
		<Link href="https://airtable.com/appfed8INlDShDOoQ/shrJoAnWxZHyd33nA" target="_blank"
			>Contact</Link
		>
	</li>
	<li class="index-entry">
		<Link
			href="https://www.airtable.com/universe/expKiUBA3E8no5Dgp/a-commonplace-book"
			target="_blank">Source</Link
		>
	</li>
</ol>

<style lang="scss">
	.index {
		column-width: 25ch;
		column-gap: 2em;
		flex: 0 1 auto;
		overflow: auto;
		margin-bottom: 1lh;
	}
	// form {
	// 	display: flex;
	// 	margin-block-end: 0.5lh;

	// 	:global(input) {
	// 		flex: 1;
	// 		text-align: center;
	// 	}
	// }
	.section-break {
		margin-block: 0.5lh;
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
</style>
