<script>
	export let data;

	$: extracts = data.extracts || [];
	$: currentSlug = data.currentSlug;

	import { setContext, getContext, tick, afterUpdate } from 'svelte';
	import Extract from '$components/Extract.svelte';
	import Card from '$components/Card.svelte';
	import generateChildSortFunction from '$helpers/generateChildSortFunction';

	let parentExtract, childExtracts = [];

	const idPrefix = 'panel';
	const activeWindow = getContext('activeWindow');
	setContext('parentContainer', 'panel');

	$: {
		if(extracts) {
			let parentIndex = extracts.findIndex(e => {
				return e.slug === currentSlug;
			});
			if(parentIndex === -1) parentIndex = 0;

			parentExtract = extracts[parentIndex];
			childExtracts = [...extracts];
			childExtracts.splice(parentIndex, 1);

			const childOrder = parentExtract.children || [];

			childExtracts.sort(generateChildSortFunction(childOrder));			
		}
	}

	afterUpdate(async () => {
		// Not quite perfect, something buggy here.
		await tick();

		if($activeWindow === 'panel') {
			const currentHash = window.location.hash;
			if(currentHash) {
				scrollPanel(currentHash.substr(1))
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
