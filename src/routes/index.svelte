<script context="module">
	import { FULL_API } from '../config.js';
	let options = {
		maxRecords: 300,
		view: 'Recent Works',
		fields: [
			'title',
			'group_name',
			'group_slug',
			'creator',
			'creator_name',
			'extracted_on',
			'group_last_updated_flat'
		]				
	};

	export async function preload(page, session) {
		let extracts;

		extracts = await this.fetch(`${FULL_API}/airtableGet?base=commonplace&table=extracts&options=${JSON.stringify(options)}`)
			.then(data => data.json())
			.catch(error => {
				console.log(error);
				return [];
			});

		return { extracts };
	}
</script>

<script>
	import { onMount } from 'svelte';
	import groupBy from 'lodash/groupBy';
	import sortBy from 'lodash/sortBy';
	import get from 'lodash/get';
	import Link from '../components/Link.svelte';
	import Spinner from '../components/Spinner.svelte';
	import slugify from '../helpers/slugify';

	export let extracts = [];
	let chunks = [];
	let loading = true;

	$: earliestGroup = new Date(extracts[extracts.length - 1]['group_last_updated_flat']);

	onMount(async () => {
		let filteredOptions = {
			...options,
			filterByFormula: `{group_last_updated_flat} <= DATETIME_PARSE('${earliestGroup}')`
		}
		const nextPage = await fetch(`${FULL_API}/airtableGet?base=commonplace&table=extracts&options=${JSON.stringify(filteredOptions)}`)
			.then(data => data.json())
			.catch(error => {
				console.log(error);
				return [];
			});
		
		extracts = nextPage;
		loading = false;
	})

	$: {
		let nested = {};
		extracts.forEach(e => {
			let groupName = get(e, 'group_name[0]', 'Ungrouped');
			let groupSlug = get(e, 'group_slug[0]', '-1');
			let extractedOn = new Date(e['extracted_on']);
			let lastUpdated = new Date(e['group_last_updated_flat']);

			if (!(typeof nested[groupName] === 'object')) {
				nested[groupName] = {
					slug: groupSlug,
					name: groupName,
					extracts: [],
					updated: lastUpdated
				};
			}

			nested[groupName].extracts.push(e);
			if (nested[groupName]['updated'] < lastUpdated) {
				nested[groupName]['updated'] = lastUpdated;
			}
		});

		let chunksWithoutLastGroup = chunks.map((chunk, i) => {
			if(i + 1 < chunks.length) {
				return chunks[i];
			}
			else {
				return chunks[i].slice(0,-1);
			}
		})

		chunks = [...chunksWithoutLastGroup, sortBy(nested, g => -g['updated'])];
	}
</script>

<div class="text-wall">
	{#each chunks as work}
	{#each work as {slug, name, extracts, updated}}
	<section class="inline">
		<h2 class="inline"><Link prefetch href="/works/{slug}">{name}</Link></h2>
		{#each extracts as {title, id}}
		<q class="inline"><Link plain href="/works/{slug}#{slugify(title)}">{title || 'Untitled'}</Link></q>{/each}</section>
	{/each}
	{/each}
	{#if loading}
	<section class="loading">
		<Spinner />
	</section>
	{/if}
</div>

<style>
	.text-wall {
		text-align: justify;
		column-width: var(--reading-width-narrow);
		column-gap: 1rem;
	}

	.inline {
		display: inline;
		font-size: inherit;
		margin: 0;
	}

	.inline :global(.link) {
		line-height: 0;
	}

	h2:after {
		content: ': ';
		margin-right: 4px;
	}

	q::before,
	q::after {
		content: none;
	}

	section:not(:last-child)::after {
		content: ' / '; /* This is a figure space. */
		color: var(--text-secondary);
	}

	q:hover {
		color: var(--theme-accent-text);
	}

	q + q::before {
		content: ' · ';
	}

	.loading {
		display: inline-block;
	}
</style>