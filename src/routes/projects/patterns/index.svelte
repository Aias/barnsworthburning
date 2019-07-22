<script>
	import { onMount } from 'svelte';
	import values from 'lodash/values';
	import keys from 'lodash/keys';
	import range from 'lodash/range';
	import size from 'lodash/size';
	import { FUNCTIONS_PATH } from '../../../config.js';

	let patterns, groups, categories;
	$: isLoaded = patterns && groups && categories;

	$: numPatterns = size(patterns);
	$: patternsCalculated = makeRelationships(patterns, numPatterns);
	$: patternArray = values(patternsCalculated).sort(sortByPosition);
	$: groupArray = values(groups).sort(sortByPosition);
	$: categoryArray = values(categories).sort(sortByPosition);

	onMount(() => {
		fetch(`/${FUNCTIONS_PATH}/patterns?table=patterns`)
			.then(data => data.json())
			.then(json => {
				patterns = json;
			});
		fetch(`/${FUNCTIONS_PATH}/patterns?table=groups`)
			.then(data => data.json())
			.then(json => {
				groups = json;
			});
		fetch(`/${FUNCTIONS_PATH}/patterns?table=categories`)
			.then(data => data.json())
			.then(json => {
				categories = json;
			});
	});

	const sortByPosition = (a, b) => a.position - b.position;

	const makeRelationships = (patterns, numPatterns) => {
		let calculated = { ...patterns };

		keys(calculated).forEach((key, i) => {
			let pattern = calculated[key];
			pattern.relationships = range(numPatterns).map(i => ({
				supports: false,
				depends_on: false,
				refers_to: false
			}));
			['supports', 'depends_on', 'refers_to'].forEach(rel => {
				if (pattern[rel]) {
					pattern[rel]
						.map(id => calculated[id])
						.forEach(n => {
							pattern.relationships[n.position][rel] = true;
						});
				}
			});
			calculated[key] = pattern;
		});
		return calculated;
	};
</script>

{#if !isLoaded}
<div>Still loading</div>
{:else}
<table>
	<thead>
		<tr>
			<th>Pattern</th>
			{#each patternArray as pattern}
			<th title="{pattern.pattern}"></th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each patternArray as pattern}
		<tr>
			<td>
				{pattern.pattern}
			</td>
			{#each pattern.relationships as rel, i} <td
			title={patternArray[i].pattern} class:depends-on={rel.depends_on}
			class:rel={true} class:refers-to={rel.refers_to}
			class:supports={rel.supports} class:self={pattern.position === i} />
			{/each}
		</tr>
		{/each}
	</tbody>
</table>
{/if}

<style>
	table {
		margin: 1em;
		width: 100%;
		border-collapse: collapse;
		table-layout: fixed;
		font-size: 9px;
		text-align: left;

		--border: 1px solid rgba(0, 0, 0, 0.05);
	}

	td {
		border-bottom: var(--border);
		border-right: var(--border);
		white-space: nowrap;
		line-height: 11px;
		padding: 0;
	}

	.rel {
		opacity: 0.8;
	}
	td:hover,
	th:hover {
		opacity: 1;
	}
	tr:hover {
		background-color: lightyellow;
	}

	tr > *:nth-child(1) {
		width: 200px;
		text-align: right;
		padding-right: 1em;
	}

	.refers-to {
		background-color: goldenrod;
	}
	.depends-on {
		background-color: firebrick;
	}
	.supports {
		background-color: steelblue;
	}
	.self {
		background-color: black;
	}
</style>
