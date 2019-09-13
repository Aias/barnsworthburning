<script context="module">
	import { FULL_API } from '../../config.js';

	export async function preload(page, session) {
		let extracts;
		let options = {
			sort: [{ field: 'last_updated', direction: 'desc' }],
			maxRecords: 300,
			fields: [
				'title',
				'group',
				'group_name',
				'creator',
				'creator_name',
				'extracted_on',
				'last_updated'
			]				
		};

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
	import groupBy from 'lodash/groupBy';
	import sortBy from 'lodash/sortBy';
	import get from 'lodash/get';
	import { selectedSpace } from '../../stores';
	import Link from '../../components/Link.svelte';

	selectedSpace.set('everything');

	export let extracts = [];
	let groups = [];

	$: {
		let nested = {};
		extracts.forEach(e => {
			let groupName = get(e, 'group_name[0]', 'Ungrouped');
			let groupId = get(e, 'group[0]', '-1');
			let extractedOn = new Date(e['extracted_on']);
			let lastUpdated = new Date(e['last_updated']);

			if (!(typeof nested[groupName] === 'object')) {
				nested[groupName] = {
					id: groupId,
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

		groups = sortBy(nested, g => -g['updated']);
	}
</script>

<div class="text-wall">
	{#each groups as {id, name, extracts, updated}}
	<section class="inline">
		<h2 class="inline"><Link prefetch href="/works/{id}">{name}</Link></h2>
		{#each extracts as {title, id}}
		<q class="inline"><Link plain href="/extracts/{id}">{title || 'Untitled'}</Link></q>
		{/each}
	</section>
	{/each}
</div>

<style>
	.text-wall {
		text-align: justify;
	}

	.inline {
		display: inline;
		font-size: inherit;
		margin: 0;
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
		content: ' / ';
		white-space: pre-wrap;
		color: var(--text-secondary);
	}

	q:hover {
		color: var(--theme-accent-text);
	}

	q + q::before {
		content: ' · ';
	}
</style>
