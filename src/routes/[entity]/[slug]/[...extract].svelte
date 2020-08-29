<script context="module">
	import select from '../../../helpers/select';

	export async function preload({ params, query }) {
		const { entity, slug, extract } = params;
		const [extractSlug, fragmentSlug] = extract;

		const filterString = `OR(CONCATENATE('-', slug, '-') = '-${extractSlug}-', FIND('${extractSlug}', parent_slug) = 1)`; // Returns true if an extract has the same slug (it is the parent) or if its parent has the same slug (it's a child of the extract we're looking for).

		const extracts = await select('extracts', {
			filterByFormula: filterString
		})(this.fetch);

		return {
			extracts,
			extractSlug,
			// fragmentSlug
		};
	}
</script>

<script>
	export let extracts = [];
	export let extractSlug
	// export let fragmentSlug;

	import { setContext } from 'svelte';
	import Extract from '../../../components/Extract.svelte';
	import Card from '../../../components/Card.svelte';

	let parentExtract, childExtracts;

	const idPrefix = 'panel';
	setContext('parentContainer', 'panel');

	$: {
		let parentIndex = extracts.findIndex(e => {
			return e.slug === extractSlug;
		});
		if(parentIndex === -1) parentIndex = 0;

		parentExtract = extracts[parentIndex];
		childExtracts = [...extracts];
		childExtracts.splice(parentIndex, 1);

		const childOrder = parentExtract.children || [];

		childExtracts.sort((a, b) => {
			const indexA = childOrder.indexOf(a.id);
			const indexB = childOrder.indexOf(b.id);

			if(indexA > indexB) return 1;
			else return -1;
		});
	}

	const scrollToFragment = (slug) => {
		const elementId = `${idPrefix}--${slug}`;

		try {
			const el = document.getElementById(elementId);
			console.log(el);

			window.scrollTo({
				top: el.offsetTop,
				behavior: 'smooth'
			});
		}
		catch(e) {
			return null;
		}
	}
</script>

<header>
	{#each [parentExtract] as parent (parent.id)}
		<Card inverted>
			<Extract extract="{parent}" {idPrefix} />
		</Card>
	{/each}	
</header>
<ol>
	{#each childExtracts as child (child.id)}
	<li>
		<Extract extract="{child}" suppressCitation {idPrefix} />
	</li>
	{/each}
</ol>

<style>
	header + ol {
		margin-top: 2rem;
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
		color: var(--text-tertiary);
	}
</style>
