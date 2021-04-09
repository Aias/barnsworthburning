<script context="module">
	export async function load({ page, fetch }) {
		const { params } = page;
		const { entity, slug, extract } = params;
		const [extractSlug, fragmentSlug] = extract;

		console.log("rendering extract", params);

		const extracts = await fetch(`/airtable/extract/${extractSlug}/${fragmentSlug}`).then(res => res.json());

		return {
			props: {
				extracts,
				extractSlug,
				fragmentSlug				
			}
		};
	}
</script>

<script>
	export let extracts = [];
	export let extractSlug
	export let fragmentSlug;

	import { setContext, getContext, tick, afterUpdate } from 'svelte';
	import Extract from '../../../components/Extract.svelte';
	import Card from '../../../components/Card.svelte';

	let parentExtract, childExtracts = [];

	const idPrefix = 'panel';
	const activeWindow = getContext('activeWindow');
	setContext('parentContainer', 'panel');

	$: {
		if(extracts) {
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
	}

	afterUpdate(async () => {
		// Not quite perfect, something buggy here.
		await tick();
		if($activeWindow === 'panel') {
			if(fragmentSlug) {
				scrollPanel(fragmentSlug)
			}
			else {
				scrollPanel();
			}
		}
	})

	const scrollPanel = (slug) => {
		try {
			let offset = 0;
			if(slug) {
				const elementId = `${idPrefix}--${slug}`;
				const el = document.getElementById(elementId);
				if(el) {
					offset = el.offsetTop;
				}			
			}

			window.scrollTo({
				top: offset - 32,
				behavior: 'smooth'
			});
		}
		catch(error) {
			return null;
			console.log(error);
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
