<script context="module">
	import select from '../../../helpers/select';

	export async function preload({ params, query }) {
		const { entity, slug, extract } = params;
		const [extractSlug, fragmentSlug] = extract;

		const filterString = `OR(CONCATENATE('-', slug, '-') = '-${extractSlug}-', FIND('${extractSlug}', parent_slug) = 1)`; // Returns true if an extract has the same slug (it is the parent) or if its parent has the same slug (it's a child of the extract we're looking for).

		console.log(extractSlug, fragmentSlug);
		const extracts = await select('extracts', {
			maxRecords: 20,
			filterByFormula: filterString
		})(this.fetch);

		return {
			extracts
		};
	}
</script>

<script>
	export let extracts = [];

	import Extract from '../../../components/Extract.svelte';
	import Card from '../../../components/Card.svelte';

	$: parentExtract = extracts.slice(0,1);
	$: childExtracts = extracts.slice(1);

	$: {
		console.log(parentExtract, childExtracts);
	}
</script>

<header>
	{#each parentExtract as parent (parent.id)}
		<Card>
			<Extract extract="{parent}" />
		</Card>
	{/each}	
</header>
<ol>
	{#each childExtracts as child (child.id)}
	<li>
		<Extract extract="{child}" />
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
