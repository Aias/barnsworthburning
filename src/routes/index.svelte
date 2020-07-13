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
		if(session.extractsLoaded) {
			return { extracts: []};
		}

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
	import { stores } from '@sapper/app';
	import { extractPages, extractWall } from '../stores/extracts';

	import Link from '../components/Link.svelte';
	import Spinner from '../components/Spinner.svelte';
	import slugify from '../helpers/slugify';

	const { session } = stores();
	$: loading = !($session.extractsLoaded);

	export let extracts = [];

	onMount(async () => {
		if($session.extractsLoaded) {
			return null;
		}

		$extractPages = [...$extractPages, extracts];

		const earliestGroup = new Date(extracts[extracts.length - 1]['group_last_updated_flat']);
		
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

		session.update(s => {
			const current = s || {};
			return {
				...current,
				extractsLoaded: true
			};
		})

		$extractPages = [...$extractPages, nextPage];
	})
</script>

<div class="text-wall">
	{#each $extractWall as {slug, name, extracts, updated}}
	<section class="inline">
		<h2 class="inline"><Link prefetch href="/works/{slug}">{name}</Link></h2>
		{#each extracts as {title, id}}
		<q class="inline"><Link plain href="/works/{slug}#{slugify(title)}">{title || 'Untitled'}</Link></q>{/each}</section>
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