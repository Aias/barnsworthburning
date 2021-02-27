<script>
	import select from '../../../helpers/select';
	import { stores } from '@sapper/app';
	import { setContext, getContext, tick, afterUpdate, onMount } from 'svelte';
	import { derived, writable } from 'svelte/store';

	import Extract from '../../../components/Extract.svelte';
	import Card from '../../../components/Card.svelte';

	const { page } = stores();

	const clientFetch = writable();

	onMount(() => {
		clientFetch.set(fetch);
	})

	let parentExtract;
	let childExtracts = [];

	const idPrefix = 'panel';
	const activeWindow = getContext('activeWindow');
	setContext('parentContainer', 'panel');

	const extractData = derived([page, clientFetch], ([$page, $clientFetch], set) => {
		if(!$clientFetch) return null;

		const { params, slug } = $page;
		const extract = params.extract;

		const extractSlug = extract ? extract[0] : null;
		const fragmentSlug = extract ? extract[1] : null;

		const filterString = `OR(CONCATENATE('-', slug, '-') = '-${extractSlug}-', FIND('${extractSlug}', parent_slug) = 1)`; // Returns true if an extract has the same slug (it is the parent) or if its parent has the same slug (it's a child of the extract we're looking for).

		select('extracts', {
			filterByFormula: filterString
		})(fetch)
			.then(({records, error}) => {
				set({
					error,
					...parentAndChildren(records, extractSlug),
					extractSlug,
					fragmentSlug
				})
			});
	})

	const parentAndChildren = (extracts, extractSlug) => {
		let parentExtract;
		let childExtracts;

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

		return {
			parentExtract,
			childExtracts
		};
	}

	afterUpdate(async () => {
		// Not quite perfect, something buggy here.
		await tick();

		const fragmentSlug = $extractData && $extractData.fragmentSlug;

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

{#if $extractData}
<header>
	{#each [$extractData.parentExtract] as parent (parent.id)}
		<Card inverted>
			<Extract extract="{parent}" {idPrefix} />
		</Card>
	{/each}	
</header>
<ol>
	{#each $extractData.childExtracts as child (child.id)}
	<li>
		<Extract extract="{child}" suppressCitation {idPrefix} />
	</li>
	{/each}
</ol>
{/if}

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
