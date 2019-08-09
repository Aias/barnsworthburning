<script>
	import { onMount } from 'svelte';
	import keys from 'lodash/keys';
	import range from 'lodash/range';
	import { FULL_API } from '../../../config.js';
	import Loading from '../../../components/Loading.svelte';

	let patterns, groups, categories;
	$: isLoaded = patterns && groups && categories;

	$: patternsCalculated = makeRelationships(patterns);
	$: patternsArr = keys(patternsCalculated)
		.map(key => patternsCalculated[key])
		.sort((a, b) => {
			return a.order - b.order;
		});

	const patternOptions = {
		fields: [
			'pattern',
			'category',
			'group',
			'significance',
			'supports',
			'depends_on',
			'refers_to'
		]
	};

	onMount(() => {
		fetch(
			`${FULL_API}/airtableGet?base=patterns&table=patterns&options=${patternOptions}`
		)
			.then(data => data.json())
			.then(json => {
				patterns = json;
			});
		fetch(`${FULL_API}/airtableGet?base=patterns?table=groups`)
			.then(data => data.json())
			.then(json => {
				groups = json;
			});
		fetch(`${FULL_API}/airtableGet?base=patterns?table=categories`)
			.then(data => data.json())
			.then(json => {
				categories = json;
			});
	});

	const makeRelationships = patterns => {
		if (!patterns) return {};
		let numPatterns = patterns.length;
		if (numPatterns === 0) return null;
		let calculated = {};

		patterns.forEach((p, i) => {
			calculated[p.id] = {
				...p,
				order: i
			};
		});

		keys(calculated).forEach(key => {
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
							pattern.relationships[n.order][rel] = true;
						});
				}
			});
			calculated[key] = pattern;
		});

		return calculated;
	};
</script>

{#if !isLoaded}
<Loading />
{:else}
<table>
	<thead>
		<tr>
			<th>Pattern</th>
			{#each patternsArr as pattern}
			<th title="{pattern.pattern}"></th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each patternsArr as pattern}
		<tr>
			<td>
				{pattern.pattern}
			</td>
			{#each pattern.relationships as rel, i} <td
			title={patternsArr[i].pattern} class:depends-on={rel.depends_on}
			class:rel={true} class:refers-to={rel.refers_to}
			class:supports={rel.supports} class:self={pattern.order === i} />
			{/each}
		</tr>
		{/each}
	</tbody>
</table>
{/if}

<style>
	table {
		width: 100%;
		border-collapse: collapse;
		table-layout: fixed;
		font-size: 9px;
		text-align: left;

		--border: 1px solid var(--layer-highlight);
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
		background-color: var(--layer-container);
	}

	tr > *:nth-child(1) {
		width: 200px;
		text-align: right;
		padding-right: 1em;
	}

	.refers-to {
		background-color: steelblue;
	}
	.depends-on {
		background-color: var(--theme-primary-bg);
	}
	.supports {
		background-color: var(--theme-accent-bg);
	}
	.self {
		background-color: var(--layer-highlight);
	}
</style>
