<script context="module">
	import { FULL_API } from '../../config.js';

	export async function preload(page, session) {
		let extracts;
		let options = {
			sort: [{ field: 'last_name', direction: 'asc' }],
			fields: ['full_name', 'last_name', 'profession', 'organization', 'site', 'work_names', 'work_slugs']
		};

		let creators = await this.fetch(
			`${FULL_API}/airtableGet?base=commonplace&table=creators&options=${JSON.stringify(options)}`
		)
			.then((data) => data.json())
			.catch((error) => {
				console.log(error);
				return [];
			});

		return { creators };
	}
</script>

<script>
	import Link from '../../components/Link.svelte';

	export let creators = undefined;
</script>

<table>
	<thead>
		<tr>
			<th>Name</th>
			<th>Homepage</th>
			<th>Professions</th>
			<th>Works</th>
		</tr>
	</thead>
	<tbody>
		{#each creators as {id, full_name, profession, work_names, work_slugs, site}}
		<tr>
			<td>
				<strong>{full_name}</strong>
			</td>
			<td>
				{#if site}
				<a href="{site}" target="_blank" title="{full_name}'s home page">Website</a>
				{/if}
			</td>
			<td>{profession ? profession.join(', ') : ''}</td>
			<td>
				{#if work_names}
				<ul>
					{#each work_names as work, i}
					<li><a href="/works/{work_slugs[i]}">{work}</a></li>
					{/each}
				</ul>
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
