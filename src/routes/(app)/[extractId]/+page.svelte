<script>
	import Extract from '$components/Extract.svelte';

	const { data } = $props();

	let extracts = $derived(data.extracts || []);
	let currentId = $derived(data.currentId);

	const makeChildSortFunction =
		(childOrder = []) =>
		(a, b) => {
			const indexA = childOrder.indexOf(a.id);
			const indexB = childOrder.indexOf(b.id);

			if (indexA > indexB) return 1;
			else return -1;
		};

	const getChildren = () => {
		if (!parentExtract.children) return [];

		let children = [...extracts];
		children.splice(parentIndex, 1);
		const childOrder = parentExtract.children || [];

		return children.sort(makeChildSortFunction(childOrder));
	};

	let parentIndex = $derived(
		extracts.findIndex((e) => {
			return e.id === currentId;
		})
	);
	let parentExtract = $derived(parentIndex > -1 ? extracts[parentIndex] : extracts[0]);
	let childExtracts = $derived(getChildren());
</script>

<header class="card">
	<Extract extract={parentExtract} />
</header>
{#if childExtracts.length > 0}
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
