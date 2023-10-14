<script>
	export let creators = [];
	export let spaces = [];

	import InternalLink from './InternalLink.svelte';
	import { page } from '$app/stores';

	// let secondarySort = 'alpha';
	let primarySort = 'alpha';

	let entityType = 'all';

	const filterList =
		(filter = 'all') =>
		(node) => {
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
	<nav>
		<ol>
			<li class:selected="{entityType === 'all'}" class="settings settings--entity-type">
				<button class="link" on:click="{() => {entityType = 'all'}}">
					<span class="settings-label">Show&nbsp;</span>Everything
				</button>
			</li>
			<li class:selected="{entityType === 'creator'}" class="settings settings--entity-type">
				<button class="link" on:click="{() => {entityType = 'creator'}}">
					<span class="settings-label">Show&nbsp;</span>Creators
				</button>
			</li>
			<li class:selected="{entityType === 'space'}" class="settings settings--entity-type">
				<button class="link" on:click="{() => {entityType = 'space'}}">
					<span class="settings-label">Show&nbsp;</span>Spaces
				</button>
			</li>
			<li class="center">
				<span class="text-tertiary">⁘  ⁘  ⁘</span>
			</li>
			<li class:selected="{primarySort === 'alpha'}" class="settings settings--primary-sort">
				<button class="link" on:click="{() => {primarySort = 'alpha'}}">
					<span class="settings-label">By&nbsp;</span>Name
				</button>
			</li>
			<li class:selected="{primarySort === 'count'}" class="settings settings--primary-sort">
				<button class="link" on:click="{() => {primarySort = 'count'}}">
					<span class="settings-label">By&nbsp;</span>Count
				</button>
			</li>
			<li class:selected="{primarySort === 'time'}" class="settings settings--primary-sort">
				<button class="link" on:click="{() => {primarySort = 'time'}}">
					<span class="settings-label">By&nbsp;</span>Time
				</button>
			</li>
			<li class="center">
				<span class="text-tertiary">⁘  ⁘  ⁘</span>
			</li>
			{#each index as node, i}
			<li class:active="{isActive(node, $page)}">
				{#if node.entity === 'creator'}
				<InternalLink toType="creators" toEntity="{node.slug}">{lastFirst(node)}</InternalLink>&nbsp;<span
					class="count text-secondary"
				>
					{node.num_extracts + node.num_fragments}
				</span>
				{:else}
				<InternalLink toType="spaces" toEntity="{node.topic}">{node.topic}</InternalLink>&nbsp;<span
					class="count text-secondary"
				>
					{node.extracts ? node.extracts.length : 0}
				</span>
				{/if}
			</li>
			{/each}
			<li class="center">
				<span class="text-tertiary">⁘  ⁘  ⁘</span>
			</li>
			<li>
				<InternalLink toType="creators" toEntity="nick-trombley" toExtract="barnsworthburningnet">
					About
				</InternalLink>
			</li>
			<li>
				<a href="/feed.xml" target="_blank" rel="noreferrer">RSS Feed</a>
			</li>
			<li>
				<a href="https://github.com/Aias/barnsworthburning" target="_blank" rel="noreferrer">Source</a>
			</li>
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
		transition: background-color 0.25s;
	}

	li.selected {
		--border-width: 4px;
		border-left: var(--border-width) solid var(--text-primary);
		margin-left: calc(-1 * var(--border-width));
	}
	li.selected button {
		color: var(--text-primary);
		font-weight: 500;
	}
	li:not(.selected) .settings-label {
		visibility: hidden;
	}

	li.active {
		background-color: var(--theme-primary);
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
