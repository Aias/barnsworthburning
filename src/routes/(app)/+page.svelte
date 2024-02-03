<script>
	let { data } = $props();

	let index = $derived(
		data.index.reduce(
			(acc, item) => {
				let { creators = [], spaces = [], type } = item;

				if (acc.types[type]) {
					acc.types[type].count++;
				} else {
					acc.types[type] = { name: type, count: 1 };
				}

				creators.forEach((creator) => {
					if (acc.creators[creator.id]) {
						acc.creators[creator.id].count++;
					} else {
						acc.creators[creator.id] = { ...creator, count: 1 };
					}
				});

				spaces.forEach((space) => {
					if (acc.spaces[space.id]) {
						acc.spaces[space.id].count++;
					} else {
						acc.spaces[space.id] = { ...space, count: 1 };
					}
				});

				return acc;
			},
			{ creators: {}, spaces: {}, types: {} }
		)
	);

	const sortByCountThenName = (a, b) => {
		if (a.count === b.count) {
			return a.name.localeCompare(b.name);
		}

		return b.count - a.count;
	};

	let creatorsByCount = $derived(Object.values(index.creators).sort(sortByCountThenName));
	let spacesByCount = $derived(Object.values(index.spaces).sort(sortByCountThenName));
	let typesByCount = $derived(Object.values(index.types).sort(sortByCountThenName));
</script>

<div class="index">
	<h2>In Recent Memory</h2>
	<section>
		<h3>Types</h3>
		<ul>
			{#each typesByCount as type}
				<li>
					<span class="name">{type.name}s</span>
					<span class="count">{type.count}</span>
				</li>
			{/each}
		</ul>
	</section>
	<section>
		<h3>Creators</h3>
		<ul>
			{#each creatorsByCount as creator}
				<li>
					<span class="name">{creator.name}</span>
					<span class="count">{creator.count}</span>
				</li>
			{/each}
		</ul>
	</section>
	<section>
		<h3>Spaces</h3>
		<ul class="spaces">
			{#each spacesByCount as space}
				<li>
					<span class="name">{space.name}</span>
					<span class="count">{space.count}</span>
				</li>
			{/each}
		</ul>
	</section>
</div>

<style lang="scss">
	.index {
		padding: 1em;
		display: flex;
		flex-direction: column;
		gap: 1em;
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
