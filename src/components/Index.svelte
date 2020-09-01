<script>
	export let creators = [];
	export let spaces = [];

	import InternalLink from './InternalLink.svelte';
	import Arrow from './icons/Arrow.svelte';
	import { stores } from '@sapper/app';
	const { page } = stores();

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

<aside class="layout__index">
	<div class="toolbar">
		<div class="field-group">
			<div class="select-wrapper">
				<select bind:value="{entityType}" aria-label="What to show">
					<option value="all">Everything</option>
					<option value="creator">Creators</option>
					<option value="space">Spaces</option>
				</select>
				<Arrow />
			</div>
			<div class="select-wrapper">
				<select bind:value="{primarySort}" aria-label="How to sort">
					<option value="time">By Time</option>
					<option value="count">By Count</option>
					<option value="alpha">Alphabetically</option>
				</select>
				<Arrow />
			</div>
		</div>
	</div>
	<nav>
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
				<InternalLink toType="creators" toEntity="{node.slug}">{lastFirst(node)}</InternalLink>&nbsp;<span
					class="count text-secondary"
				>
					{node.num_extracts + node.num_fragments}
				</span>
				{:else}
				<InternalLink toType="spaces" toEntity="{node.topic}"><span class="screenreader">Subspace:</span>{node.topic}</InternalLink>&nbsp;<span
					class="count text-secondary"
				>
					{node.extracts ? node.extracts.length : 0}
				</span>
				{/if}
			</li>
			{/each}
		</ol>
	</nav>
</aside>

<style>
	aside {
		height: 100%;
		overflow-y: hidden;
		display: flex;
		flex-direction: column;
	}
	nav {
		flex: 1;
		overflow-y: auto;
		padding-right: 0.5rem;
		margin-right: -0.5rem;
		padding-left: 1rem;
		margin-left: -1rem;
	}
	.toolbar {
		flex: 0 0 auto;
		padding-bottom: 1rem;
	}

	.field-group {
		--separation: 1rem;
		display: flex;
		flex-wrap: wrap;
		margin-left: calc(-1 * var(--separation));
		max-width: 400px;
	}

	.field-group > * {
		margin-left: var(--separation);
		margin-bottom: 0.5rem;
		flex: 1 0 125px;
	}

	.select-wrapper {
		position: relative;
	}

	.select-wrapper:focus-within > :global(.icon) {
		transform: translateY(-50%) rotate(180deg);
		color: var(--text-secondary);
	}

	.select-wrapper > :global(.icon) {
		position: absolute;
		pointer-events: none;
		right: 10px;
		top: calc(50% + 1px);
		font-size: 9px;
		height: 1em;
		width: 1em;
		display: block;
		transform: translateY(-50%);
		color: var(--text-tertiary);
		fill: currentColor;
		transition: all 0.25s;
	}

	select {
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		width: 100%;
	}

	ol {
		--cantilever: 8px;
		margin: 0 0 0 calc(-1 * var(--cantilever));
		list-style-type: none;
		column-width: 23ch;
		column-gap: var(--padding);
		font-size: var(--font-size-0);
	}

	li {
		--indent: 1em;
		padding-left: calc(var(--indent) + var(--cantilever));
		padding-right: var(--cantilever);
		text-indent: calc(-1 * var(--indent));
		position: relative;
		transition: background-color 0.25s;
	}

	li.active {
		background-color: currentColor;
		--text-secondary: var(--clr-lighter-40);
	}

	li.active :global(a) {
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
