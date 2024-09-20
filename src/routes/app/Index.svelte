<script lang="ts">
	import { page } from '$app/stores';
	import { entityTypes, type EntityType } from '$helpers/params';
	import Link from '$components/Link.svelte';
	import type { ICreator, ISpace } from '$types/Airtable';
	import type { HTMLOlAttributes } from 'svelte/elements';

	interface IndexProps extends HTMLOlAttributes {
		creators: ICreator[];
		spaces: ISpace[];
	}
	let { creators, spaces, ...restProps }: IndexProps = $props();

	interface IndexEntry {
		type: EntityType;
		name: string;
		id: string;
		count: number;
	}

	let pageParams = $derived($page.params || {});

	const index = $derived.by(() => {
		const creatorEntries = creators.map((c) => ({
			type: entityTypes.creator,
			name: c.name || 'Unknown',
			id: c.id,
			count: c.numExtracts
		}));
		const spaceEntries = spaces.map((s) => ({
			type: entityTypes.space,
			name: s.topic || 'general',
			id: s.id,
			count: s.numExtracts
		}));
		const all = [...creatorEntries, ...spaceEntries].sort(sortByName);

		return all;
	});

	function sortByName(a: IndexEntry, b: IndexEntry) {
		return a.name.localeCompare(b.name);
	}
</script>

<ol class="index" class:themed={true} {...restProps}>
	{#each index as entry (entry.id)}
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
		<Link toType="extract" toId="recBkp3allrWUXK72">Contact</Link>
	</li>
	<li class="index-entry">
		<Link
			href="https://www.airtable.com/universe/expKiUBA3E8no5Dgp/a-commonplace-book"
			target="_blank">Source</Link
		>
	</li>
</ol>

<style>
	.index {
		column-width: 25ch;
		column-gap: 2em;
		flex: 0 1 auto;
		overflow: auto;
		margin-bottom: 1lh;
	}
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
