<script>
	let { data, ...rest } = $props();

	let extracts = data.extracts || [];
	let currentSlug = data.currentSlug;

	// import Extract from '$components/Extract.svelte';

	let parentExtract = $state([]);
	let childExtracts = $state([]);

	const makeChildSortFunction = (childOrder = []) =>
	(a, b) => {
		const indexA = childOrder.indexOf(a.id);
		const indexB = childOrder.indexOf(b.id);

		if (indexA > indexB) return 1;
		else return -1;
	};

	$effect(() => {
		if(extracts) {
			let parentIndex = extracts.findIndex(e => {
				return e.slug === currentSlug;
			});
			if(parentIndex === -1) parentIndex = 0;

			parentExtract = extracts[parentIndex];
			childExtracts = [...extracts].splice(parentIndex, 1);

			const childOrder = parentExtract.children || [];

			childExtracts.sort(makeChildSortFunction(childOrder));			
		}
	})
</script>

<header class="card">
	Some stuff in here.
</header>
<ol>
	{#each childExtracts as child (child.id)}
	<li>
		{child.slug}
	</li>
	{/each}
</ol>

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