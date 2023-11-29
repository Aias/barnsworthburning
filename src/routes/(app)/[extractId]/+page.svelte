<script>
	import Extract from '$components/Extract.svelte';

	export let data;

	$: extracts = data.extracts || [];
	$: currentId = data.currentId;
	let parentExtract,
		childExtracts = [];

	const makeChildSortFunction =
		(childOrder = []) =>
		(a, b) => {
			const indexA = childOrder.findIndex((val) => val.id === a.id);
			const indexB = childOrder.findIndex((val) => val.id === b.id);

			if (indexA > indexB) return 1;
			else return -1;
		};

	const getChildren = (extracts, parentIndex) => {
		if (!parentExtract.children) return undefined;

		let children = [...extracts];
		children.splice(parentIndex, 1);
		const childOrder = parentExtract.children || [];

		return children.sort(makeChildSortFunction(childOrder));
	};

	$: {
		if (extracts) {
			let parentIndex = extracts.findIndex((e) => {
				return e.id === currentId;
			});
			if (parentIndex === -1) parentIndex = 0;

			parentExtract = extracts[parentIndex];
			childExtracts = getChildren(extracts, parentIndex);
		}
	}
</script>

<header class="card">
	<Extract extract={parentExtract} />
</header>
{#if childExtracts}
	<ol>
		{#each childExtracts as child (child.id)}
			<li>
				<Extract extract={child} />
			</li>
		{/each}
	</ol>
{/if}

<style>
	header + ol {
		margin-top: var(--padding);
	}

	ol {
		list-style-type: none;
		padding: 0;
	}

	li + li::before {
		content: '∵';
		display: block;
		margin-top: 1.5rem;
		margin-bottom: 1.5rem;
		text-align: center;
		color: var(--hint);
	}
</style>
