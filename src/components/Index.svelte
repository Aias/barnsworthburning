<script>
	export let creators = [];
	export let spaces = [];

	$: index = creators
		.map((c) => ({ ...c, type: 'creator' }))
		.concat(spaces.map((s) => ({ ...s, type: 'space' })))
		.sort(compareFields);

	const getSortField = (obj) => {
		if (obj.type === 'creator') {
			return obj.last_name || '';
		} else {
			return obj.topic || '';
		}
	};

	const compareFields = (a, b) => {
		return getSortField(a).toLowerCase() > getSortField(b).toLowerCase()
			? 1
			: getSortField(a).toLowerCase() < getSortField(b).toLowerCase()
			? -1
			: 0;
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
</script>

<ol>
	{#each index as {type, ...node}, i}
	<li>
		{#if type === 'creator'}
		<a href="/creator/{node.slug}">{lastFirst(node)}</a>&nbsp;<span class="text-secondary">
			{node.extracts ? node.extracts.length : 0}
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
	ol {
		margin: 0;
		list-style-type: none;
		column-width: 20ch;
		column-gap: 5ch;
		font-size: 10.5px;
	}

	li {
		--indent: 1em;
		padding-left: var(--indent);
		text-indent: calc(-1 * var(--indent));
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
