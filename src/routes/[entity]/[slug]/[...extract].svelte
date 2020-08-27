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
			//fragmentSlug
		};
	}
</script>

<script>
	export let extracts = [];
	export let extractSlug
	// export let fragmentSlug;

	import Extract from '../../../components/Extract.svelte';
	import Card from '../../../components/Card.svelte';

	let parentExtract, childExtracts;

	$: {
		let parentIndex = extracts.findIndex(e => {
			return e.slug === extractSlug;
		});
		if(parentIndex === -1) parentIndex = 0;

		parentExtract = [extracts[parentIndex]];
		childExtracts = [...extracts];
		childExtracts.splice(parentIndex, 1);
	}
</script>

<header>
	{#each parentExtract as parent (parent.id)}
		<Card inverted>
			<Extract extract="{parent}" />
		</Card>
	{/each}	
</header>
<ol>
	{#each childExtracts as child (child.id)}
	<li>
		<Extract extract="{child}" suppressCitation />
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
		margin-bottom: 1rem;
		text-align: center;
		color: var(--text-tertiary);
	}
</style>
