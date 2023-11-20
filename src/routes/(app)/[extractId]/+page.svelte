<script>
	import Extract from '$components/Extract.svelte';

	let { data } = $props();

	let extracts = data.extracts || [];
	let currentId = data.currentId;

	const makeChildSortFunction =
		(childOrder = []) =>
		(a, b) => {
			const indexA = childOrder.indexOf(a.id);
			const indexB = childOrder.indexOf(b.id);

			if (indexA > indexB) return 1;
			else return -1;
		};

	const getChildren = () => {
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
<ol>
	{#each childExtracts as child (child.id)}
		<li>
			<Extract extract={child} />
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
