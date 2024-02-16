<script lang="ts">
	import '$styles/app.css';
	import Header from '$components/Header.svelte';
	import Looseleaf from '$components/Looseleaf.svelte';
	import { encodeSegment, entities } from '$helpers/params';
	import type { IExtract } from '../types/Extract';

	let { children, data } = $props();

	$inspect(data.index);

	type IndexEntity = { id: string; name: string; count: number };

	type Index = {
		formats: { [id: string]: IndexEntity };
		creators: { [id: string]: IndexEntity };
		spaces: { [id: string]: IndexEntity };
	};

	let index: Index = $derived(
		data.index.reduce(
			(acc: Index, item: IExtract) => {
				let { creators, spaces, format } = item;

				if (format) {
					if (acc.formats[format]) {
						acc.formats[format].count++;
					} else {
						acc.formats[format] = { id: format, name: format, count: 1 };
					}
				}

				if (creators) {
					creators.forEach((creator) => {
						if (acc.creators[creator.id]) {
							acc.creators[creator.id].count++;
						} else {
							acc.creators[creator.id] = {
								id: creator.id,
								name: creator.name,
								count: 1
							};
						}
					});
				}

				if (spaces) {
					spaces.forEach((space) => {
						if (acc.spaces[space.id]) {
							acc.spaces[space.id].count++;
						} else {
							acc.spaces[space.id] = { id: space.id, name: space.name, count: 1 };
						}
					});
				}

				return acc;
			},
			{ creators: {}, spaces: {}, formats: {} }
		)
	);

	const sortByCountThenName = (a: IndexEntity, b: IndexEntity) => {
		if (a.count === b.count) {
			return a.name.localeCompare(b.name);
		}

		return b.count - a.count;
	};

	let creatorsByCount = $derived(Object.values(index.creators).sort(sortByCountThenName));
	let spacesByCount = $derived(Object.values(index.spaces).sort(sortByCountThenName));
	let formatsByCount = $derived(Object.values(index.formats).sort(sortByCountThenName));
</script>

<Header class="app-header" />
<main class="app-content">
	<div class="index">
		<h2>In Recent Memory</h2>
		<section class="looseleaf">
			<Looseleaf extracts={data.index} />
		</section>
		<section>
			<h3>{entities.format.plural}</h3>
			<ul>
				{#each formatsByCount as format}
					<li>
						<a class="name" href={`${encodeSegment(entities.format, format.name)}`}
							>{format.name}</a
						>
						<span class="count">{format.count}</span>
					</li>
				{/each}
			</ul>
		</section>
		<section>
			<h3>{entities.creator.plural}</h3>
			<ul>
				{#each creatorsByCount as creator}
					<li>
						<a class="name" href={`${encodeSegment(entities.creator, creator.id)}`}
							>{creator.name}</a
						>
						<span class="count">{creator.count}</span>
					</li>
				{/each}
			</ul>
		</section>
		<section>
			<h3>{entities.space.plural}</h3>
			<ul class="spaces">
				{#each spacesByCount as space}
					<li>
						<a class="name" href={`${encodeSegment(entities.space, space.id)}`}
							>{space.name}</a
						>
						<span class="count">{space.count}</span>
					</li>
				{/each}
			</ul>
		</section>
	</div>
	{@render children()}
</main>

<style lang="scss">
	.index {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}
	.looseleaf {
		flex: 1 0 auto;
		max-height: 25vh;
		overflow-y: auto;
		font-size: 0.25em;
	}
	section {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}
	ul {
		--gap: 0.5em;
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		column-gap: 0.5em;
	}
	li:not(:last-child)::after {
		content: '/';
		margin-left: var(--gap);
		color: var(--divider);
	}
	.spaces .name {
		text-transform: lowercase;
	}
	.count {
		color: var(--hint);
		padding-left: 0.25em;
	}
</style>
