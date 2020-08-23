<script>
	import { stores } from '@sapper/app';
	const { page } = stores();

	export let creators = [];
	export let spaces = [];

	// let secondarySort = 'alpha';
	let primarySort = 'alpha';

	$: index = creators
		.map((c) => ({ ...c, entity: 'creator' }))
		.concat(spaces.map((s) => ({ ...s, entity: 'space' })))
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

		return node.entity === params.entity && getSlug(node) === params.slug;
	};
</script>

<div class="toolbar">
	<label>
		<input type="radio" name="sort" bind:group="{primarySort}" value="alpha" />
		Alpha
	</label>
	<label>
		<input type="radio" name="sort" bind:group="{primarySort}" value="time" />
		Time
	</label>
	<label>
		<input type="radio" name="sort" bind:group="{primarySort}" value="count" />
		Count
	</label>
</div>

<ol>
	{#each index as node, i}
	<li class:active="{isActive(node, $page)}">
		{#if node.entity === 'creator'}
		<a href="/creator/{node.slug}">{lastFirst(node)}</a>&nbsp;<span class="text-secondary">
			{node.num_extracts + node.num_fragments}
		</span>
		{:else}
		<a href="/space/{node.topic}">{node.topic}</a>&nbsp;<span class="text-secondary">
			{node.extracts ? node.extracts.length : 0}
		</span>
		{/if}
	</li>
	{/each}
</ol>

<style>
	.toolbar {
		display: flex;
		margin-bottom: 1rem;
	}

	.toolbar > * + * {
		margin-left: 0.5rem;
	}

	ol {
		margin: 0;
		list-style-type: none;
		column-width: 25ch;
		column-gap: 5ch;
		font-size: 10.5px;
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

	li.active span {
		opacity: 0.75;
	}

	span {
		margin-left: 1em;
		text-align: right;
		opacity: 0.25;
		transition: opacity 0.15s;
	}

	li:hover > span {
		opacity: 1;
	}
</style>
