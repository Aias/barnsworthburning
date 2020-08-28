<script>
	import { stores } from '@sapper/app';
	const { page } = stores();

	export let creators = [];
	export let spaces = [];

	// let secondarySort = 'alpha';
	let primarySort = 'time';

	let entityType = 'all';

	const filterList = (filter = 'all') => (node) => {
		if (filter === 'all') {
			return true;
		} else {
			return node.entity === filter;
		}
	};

	$: index = creators
		.map((c) => ({ ...c, entity: 'creator' }))
		.concat(spaces.map((s) => ({ ...s, entity: 'space' })))
		.filter(filterList(entityType))
		// .sort(compareFields(secondarySort))
		.sort(compareFields(primarySort));

	const getAlpha = (obj) => {
		if (obj.entity === 'creator') {
			return obj.last_name || '';
		} else {
			return obj.topic || '';
		}
	};

	const getTime = (obj, type = 'connections') => {
		switch (type) {
			case 'record':
				return new Date(obj.last_updated);
			case 'connections':
			default:
				return new Date(obj.connections_last_updated);
		}
	};

	const getCount = (obj) => {
		if (obj.entity === 'creator') {
			return obj.num_extracts + obj.num_fragments;
		} else {
			return obj.extracts.length;
		}
	};

	const compareFields = (sort = 'alpha') => {
		switch (sort) {
			case 'alpha':
				return (a, b) => {
					return getAlpha(a).toLowerCase() > getAlpha(b).toLowerCase()
						? 1
						: getAlpha(a).toLowerCase() < getAlpha(b).toLowerCase()
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

	const getSlug = (obj) => {
		return obj.entity === 'creator' ? obj.slug : obj.topic;
	};

	const lastFirst = (creator) => {
		const last = creator.last_name;
		const full = creator.full_name;

		if (last === full) {
			// e.g., single-word names like Homer or Virgil
			return full;
		}

		const lastLoc = full.indexOf(last);
		const firstPart = full.substring(0, lastLoc).trim();

		return `${last}, ${firstPart}`;
	};

	const isActive = (node, page) => {
		const { params } = page;

		return params.entity && params.entity.indexOf(node.entity) > -1 && getSlug(node) === params.slug;
	};
</script>

<div class="toolbar">
	<select bind:value="{entityType}">
		<option value="all">Everything</option>
		<option value="creator">Creators</option>
		<option value="space">Spaces</option>
	</select>
	<select bind:value="{primarySort}">
		<option value="time">By Time</option>
		<option value="count">By Count</option>
		<option value="alpha">Alphabetically</option>
	</select>
</div>

<ol>
	<!-- <li class="recent">
		<a href="/recent">Recent Things</a>
	</li>
	<li class="center">
		<span class="text-tertiary">⁘  ⁘  ⁘</span>
	</li> -->
	{#each index as node, i}
	<li class:active="{isActive(node, $page)}">
		{#if node.entity === 'creator'}
		<a href="/creators/{node.slug}">{lastFirst(node)}</a>&nbsp;<span class="count text-secondary">
			{node.num_extracts + node.num_fragments}
		</span>
		{:else}
		<a href="/spaces/{node.topic}">{node.topic}</a>&nbsp;<span class="count text-secondary">
			{node.extracts ? node.extracts.length : 0}
		</span>
		{/if}
	</li>
	{/each}
</ol>

<style>
	.toolbar {
		--separation: 1rem;
		display: flex;
		flex-wrap: wrap;
		position: sticky;
		top: 0;
		background-color: var(--layer-bg);
		z-index: 1;
		padding-bottom: 1rem;
		margin-left: calc(-1 * var(--separation));
		margin-top: -0.5rem;
		max-width: 400px;
	}

	.toolbar > * {
		margin-left: var(--separation);
		margin-top: 0.5rem;
	}

	select {
		flex: 1 0 125px;
	}

	ol {
		margin: 0;
		list-style-type: none;
		column-width: 25ch;
		column-gap: 5ch;
		font-size: var(--font-size-0);
	}

	li {
		--indent: 1em;
		--padding: 8px;
		padding-left: calc(var(--indent) + var(--padding));
		padding-right: var(--padding);
		margin-left: calc(-1 * var(--padding));
		text-indent: calc(-1 * var(--indent));
		position: relative;
		transition: background-color 0.25s;
	}

	li.active {
		background-color: currentColor;
		--text-secondary: var(--clr-lighter-40);
	}

	li.active a {
		color: var(--text-inverted);
	}

	li.active .count {
		opacity: 0.75;
	}

	.count {
		margin-left: 1em;
		text-align: right;
		opacity: 0.25;
		transition: opacity 0.15s;
	}

	li:hover > .count {
		opacity: 1;
	}
</style>
