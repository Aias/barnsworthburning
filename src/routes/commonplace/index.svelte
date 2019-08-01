<script context="module">
	import { FULL_API } from '../../config.js';

	export async function preload(page, session) {
		const extracts = await this.fetch(`${FULL_API}/extractsSimple`).then(
			data => data.json()
		);

		return { extracts };
	}
</script>

<script>
	import groupBy from 'lodash/groupBy';
	import sortBy from 'lodash/sortBy';
	export let extracts = [];
	let groups = [];

	$: {
		let nested = {};
		extracts.forEach(e => {
			let groupName = e['group_name'][0];
			let extractedOn = new Date(e['extracted_on']);

			if (!(typeof nested[groupName] === 'object')) {
				nested[groupName] = {
					id: e['group'][0],
					name: groupName,
					extracts: [],
					updated: extractedOn
				};
			}

			nested[groupName].extracts.push(e);
			if (nested[groupName]['updated'] < extractedOn) {
				nested[groupName]['updated'] = extractedOn;
			}
		});

		groups = sortBy(nested, g => -g['updated']);
		// console.log(groups);
	}
</script>

<div>
	{#each groups as {id, name, extracts, updated}}
	<section>
		<h2><a href="/commonplace/groups/{id}">{name}</a></h2>
		{#each extracts as {title, id}}
		<q><a href="/commonplace/extracts/{id}">{title}</a></q>
		{/each}
	</section>
	{/each}
</div>

<style>
	div {
		display: inline;
		text-align: justify;
	}

	section,
	h2,
	q {
		display: inline;
		font-size: 1rem;
		line-height: 1.8rem;
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

	section::after {
		content: '';
		margin-right: 1rem;
	}

	q + q::before {
		content: ' · ';
	}

	q > a {
		all: inherit;
	}

	q > a:hover {
		cursor: pointer;
		color: var(--theme-primary);
	}
</style>
