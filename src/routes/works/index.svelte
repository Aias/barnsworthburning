<script context="module">
	import { FULL_API } from '../../config.js';

	export async function preload(page, session) {
		let extracts;
		let options = {
			sort: [{ field: 'name', direction: 'asc' }],
			fields: [
				'name',
				'type',
				'slug',
				'creator',
				'creator_names',
				'num_extracts',
				'source_url',
				'direct_extracts'
			],
			filterByFormula: `num_extracts > 0`
		};

		let works = await this.fetch(
			`${FULL_API}/airtableGet?base=commonplace&table=groups&options=${JSON.stringify(
				options
			)}`
		)
			.then(data => data.json())
			.catch(error => {
				console.log(error);
				return [];
			});

		return { works };
	}
</script>

<script>
	import { selectedSpace } from '../../stores';
	import Link from '../../components/Link.svelte';

	selectedSpace.set('works');

	export let works = undefined;
</script>

<table>
	<thead>
		<tr>
			<th>Title</th>
			<th>Type</th>
			<th>Creator</th>
			<th class="text-right">Extract Count</th>
			<th>Source</th>
		</tr>
	</thead>
	<tbody>
		{#each works as {name, slug, type, creator_names, num_extracts, source_url}}
		<tr>
			<td>
				<Link prefetch href="/works/{slug}">{name}</Link>
			</td>
			<td>{type ? type : ''}</td>
			<td>
				{#if creator_names}
				<ul>
					{#each creator_names as creator}
					<li>{creator}</li>
					{/each}
				</ul>
				{/if}
			</td>
			<td class="text-right">{num_extracts}</td>
			<td>
				{#if source_url}
				<a href="{source_url}" target="_blank" title="Original source"
					>Source</a
				>
				{/if}
			</td>
		</tr>
		{/each}
	</tbody>
</table>

<style>
	ul {
		margin: 0;
		padding: 0 0 0 1.2rem;
	}
</style>
